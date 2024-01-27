const Jobs = require('../models/jobs.js');
const Activity = require('../models/activity.js')
const scraper = require('../utils/automations/scraper');
const ErrorResponse = require('../utils/error/errorResponse');
const config = require('../config/config.js')
const { notifySlack } = require("./integrations/slack")
const uuid = require("uuid") 
module.exports = {

    get_all: async (query) => {
        try {
            let prompt = {
                approved: true
            };
            let page = query.page * 1 || 1;
            let limit = query.limit || 10;
            let skip = (page - 1) * limit;
            let count = 0;

            if (query.title) {
                prompt.title = { $regex: query.title, $options: 'i' };
            }
            if (query.company) {
                prompt.company = query.company;
            }
            if (query.exp) {
                prompt.exp = query.exp;
            }
            if (query.live) {
                prompt.expiryDate =  {
                    $gte: new Date()
                }
            }

            if (query.expired) {
                prompt.expiryDate =  {
                    $lte: new Date()
                }
            }
            if (query.workplaceType) {
                prompt.workplaceType = query.workplaceType
            }
            if (query.location) {
                prompt.location = query.location
            }

            if (query.stack) {
                prompt.searchKeywords =  {
                    $in: query.stack
                }
            }

            const jobs = await Jobs.find(prompt)
                .skip(skip)
                .limit(limit)
                .sort({createdAt: -1})
                ;
            if (jobs) {
                count = jobs.length
            }
            const total  = await Jobs.countDocuments();
            const totalPages = Math.ceil(total / limit);

            return {
                jobs,
                page,
                limit,
                count,
                total,
                totalPages
            };
        } catch (error) {
            throw error;
        }
    },

    get: async (id,user) => {
        try {
            const job = await Jobs.findById(id);

            if (!job) {
                throw new ErrorResponse(
                    404,
                    "Job not found"
                )
            }
            job.views += 1
            await job.save()
            return job;
        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try {
            const job = await Jobs.create(body);
            if (job) {
                const activity = {
                    user_id: job.uploader_id,
                    module: "job",
                    activity: {
                        activity: "Job Upload",
                        title: job.title,
                        location: job.location,
                        company: job.company,
                        datePosted: job.datePosted,
                        expiryDate: job.expiryDate,
                        workplaceType: job.workplaceType,
                        contractType: job.contractType,
                        status: "Successful"
                    }
                }

                await Activity.create(activity)
            }
            return job;
        } catch (error) {
            const activity = {
                user_id: body.uploader_id,
                module: "job",
                activity: {
                    activity: "Job Upload",
                    title: body.title,
                    location: body.location,
                    company: body.company,
                    datePosted: body.datePosted,
                    expiryDate: body.expiryDate,
                    workplaceType: body.workplaceType,
                    status: "failed"
                }
            }

            await Activity.create(activity)

            throw error;
        }
    },

    count: async () => {
        try {
            const count = await Jobs.countDocuments();
            return count;
        } catch (error) {
            throw error;
        }
    },

    activity: async (page, limit) => {
        const skip = (page - 1) * limit;
        let count = 0
        try {
            const activity = await Activity.find({
                module: "job"
            }).skip(skip).limit(limit).sort({createdAt: -1})
            if (activity) {
                count = activity.length
            }


            const total  = await Activity.countDocuments({
                module: "job"
            });
            const totalPages = Math.ceil(total / limit);

            return {
                activity,
                page,
                limit,
                count,
                total,
                totalPages
            }
        } catch (error) {
            throw error
        }
    },

    remove: async (id,user_id) => {
        try {
            const job = await Jobs.findById(id);
            if (job) {
                await Jobs.findByIdAndDelete(id);
                const activity = {
                    user_id: user_id,
                    module: "job",
                    activity: {
                        activity: "Job Removal",
                        title: job.title,
                        location: job.location,
                        company: job.company,
                        datePosted: job.datePosted,
                        expiryDate: job.expiryDate,
                        workplaceType: job.workplaceType,
                        contractType: job.contractType,
                        status: "Successful"
                    }
                }

                await Activity.create(activity)
            } else {
                throw new ErrorResponse(
                    400,
                    "Job not found"
                )
            }
            return null
        } catch (error) {

            throw error;
        }
    },

    getMetrics: async () => {
        try {
            const jobs = await Jobs.find();
            let total = jobs.length
            let views = 0

            if (jobs) {
                jobs.forEach((job) => {
                    views += job.views
                })
            }

            return {
                total,
                views
            };
        } catch (error) {
            throw error;
        }
    },

    deleteExpiredJobs: async () => {
        try {
            const expiredJobs = await Jobs.find(
                {
                    expiryDate: { $lte: new Date() }
                });

            if (!expiredJobs || !expiredJobs.length) {
                return true
            }

          if (expiredJobs.length > 0) {
            const expiredJobIds = expiredJobs.map((job) => job._id);
            await Jobs.deleteMany({ _id: { $in: expiredJobIds } });
            const activityPromises = expiredJobs.map((job) => {
            const activity = {
                user_id: "64feb85db96fbbd731c42d5f",
                module: "job",
                activity: {
                    activity: "Job Removal(Worker)",
                    title: job.title,
                    location: job.location,
                    company: job.company,
                    datePosted: job.datePosted,
                    expiryDate: job.expiryDate,
                    workplaceType: job.workplaceType,
                    contractType: job.contractType,
                    status: "Successful"
                }
                };
                return Activity.create(activity);
            });

            try {
                await Promise.all(activityPromises);
            } catch (err) {
                throw new ErrorResponse(
                    400,
                    "Failed to delete Job"
                )
            }

            }
            return true;
        } catch (error) {
            console.error(error);
            return false
        }
    },

    createScrapedJobs: async (data) => {
        try {
            const dataUpload = data.uniqueJobsArray || [];
            let activityIdMap = {}
            if (dataUpload && dataUpload.length) {
                const bulkOps = dataUpload.map((job,index) => {
                    const activityId = uuid.v4();
                    job.activityId = activityId;
                    job.approved = false
                    activityIdMap[index] = activityId;
                    job.searchKeywords = [];
                    const jobTitle = job.title;
                    const keywords = [];
                
                    const words = jobTitle.split(' ');

                    for (let i = 0; i < words.length; i++) {
                        for (let j = i; j < words.length; j++) {
                            const keyword = words.slice(i, j + 1).join(' ');
                            keywords.push(keyword);
                            keywords.push(keyword.toLowerCase());
                        }
                    }
                
                    job.searchKeywords = [...job.searchKeywords, ...keywords];

                    return {
                        updateOne: {
                            filter: {
                                title: job.title,
                                location: job.location,
                                company: job.company
                            },
                            update: { $set: job },
                            upsert: true
                        }
                    };
                });
                
                await Jobs.bulkWrite(bulkOps);
                
                const activityPromises = dataUpload.map((job) => {

                    return Activity.create({
                        user_id: "64feb85db96fbbd731c42d5f",
                        module: "job",
                        activity: {
                            activity: "Job Upload(Worker)",
                            title: job.title,
                            location: job.location,
                            company: job.company,
                            datePosted: job.datePosted,
                            expiryDate: job.expiryDate,
                            workplaceType: job.workplaceType,
                            contractType: job.contractType,
                            status: "Successful"
                        }
                    });
                });

                const notifySlackPromise = dataUpload.map((job,index) => {
                    return notifySlack({
                        moduleType: "notifyScrapedJobApproval",
                        notificationData: {
                            Title: job.title,
                            Location: job.location,
                            Company: job.company,
                            Workplace_Type: job.workplaceType,
                            Contract_Type: job.contractType,
                            Experience: job.exp,
                            Activity_ID: activityIdMap[index],
                            Approval_status: "pending"
                        },
                        image: {
                            url: job.poster,
                            altText: job.title
                        },
                        activityTag:  activityIdMap[index] || null
                    })
                })
    
                try {
                    await Promise.all(activityPromises);
                    await Promise.allSettled(notifySlackPromise)
                    return data.uniqueJobsArray;
                } catch (err) {
                    console.error(err.message)
                    return data.uniqueJobsArray;
                }
            } else {
                throw new ErrorResponse(400, "No jobs found");
            }
        } catch (err) {
            if (err.message?.includes("TimeoutError")) {
                throw new ErrorResponse(400, "timeout");
            } else {
                throw new ErrorResponse(400, err.message);
            }
        }
    },
    
    scrapeNoobJobs: async () => {
        try {
            const searchTags = config.SCRAPE_STACK_KEYWORDS;
            await scraper.scrapeJobsRSS({
                searchTags,
                age: 7,
                expires: 7
            })
            return true
        } catch (error) {
            console.error(error);
            return false
        }
    },

    approveScrapedJob: async ({activityTag,userInfo}) => {
        try {
            const job = await Jobs.findOne({
                activityId: activityTag
            });
            if (job) {
                job.approved = true;
                await job.save();
                const activity = {
                    user_id: "64feb85db96fbbd731c42d5f" ,
                    module: "job",
                    activity: {
                        activity: "Job Approval",
                        title: job.title,
                        location: job.location,
                        company: job.company,
                        datePosted: job.datePosted,
                        expiryDate: job.expiryDate,
                        workplaceType: job.workplaceType,
                        contractType: job.contractType,
                        triggeredBy: userInfo,
                        status: "Successful"
                    }
                }

                await Activity.create(activity)
                return {
                    message: `${activityTag}(${job.title}) approved successfully`
                }
            } else {
                throw new ErrorResponse(
                    400,
                    "Job not found"
                )
            }
        } catch (error) {
            throw error;
        }
    },

    rejectScrapedJob: async ({activityTag,userInfo}) => {
        try {
            const job = await Jobs.findOne({
                activityId: activityTag
            });

            if (!job) {
                return true
            }

            if (job) {
                await Jobs.findByIdAndDelete(job._id);
                const activity = {
                    user_id: "64feb85db96fbbd731c42d5f" ,
                    module: "job",
                    activity: {
                        activity: "Job Rejection",
                        title: job.title,
                        location: job.location,
                        company: job.company,
                        datePosted: job.datePosted,
                        expiryDate: job.expiryDate,
                        workplaceType: job.workplaceType,
                        contractType: job.contractType,
                        triggeredBy: userInfo,
                        status: "Successful"
                    }
                }

                await Activity.create(activity)
                return {
                    message: `${activityTag}(${job.title}) removed successfully`
                }
            } else {
                throw new ErrorResponse(
                    400,
                    "Job not found"
                )
            }
        } catch (error) {
            throw error
        }
    },
    


    // rate: async (id, rating) => {
    //     try {
    //         const body = {
    //             user_id: rating.user_id,
    //             rating: rating.rating
    //          };
    //         const jobs = await Jobs.findByIdAndUpdate(id, { $push: { ratings: body } }, { new: true });
    //         return jobs;
    //     } catch (error) {
    //         throw error;
    //     }
    //}
};
