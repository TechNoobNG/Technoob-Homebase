const services = require('../services/index');
const jobs = services.jobs;

module.exports = {
     async get_all (req, res) {
        const query = req.query
        try {
            const job = await jobs.get_all(query)
            res.ok({
                status: "success",
                message: `${job.count} Job(s) retrieved`,
                data: job
            })
        } catch (error) {
           res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async get(req, res, next) {
        const id = req.params.id
        const user = req.user?._id || 0
        try {
            const job = await jobs.get(id,user)
            res.ok({
                status: "success",
                message: `Job retrieved`,
                data: job
            })
        } catch (error) {
           res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async getMetrics(req, res, next) {
        try {
            const jobsMetrics = await jobs.getMetrics()
            res.ok({
                status: "success",
                message: `Job metrics retrieved`,
                data: jobsMetrics
            })
        } catch (error) {
           res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async create (req, res, next) {
        const payload = req.body

        payload.uploader_id = req.user?._id

        if (!payload.uploader_id) {
            throw new Error("Invalid user")
        }
        try {
            const job = await jobs.create(payload)
            res.ok({
                status: "success",
                message: `Job created`,
                data: job,
                statusCode: 201 
            })
        } catch (error) {
           res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async count(req, res, next) {
        try {
            const count = await jobs.count()
            res.ok({
                status: "success",
                message: `job count`,
                data: count
            })
        } catch (error) {
           res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async remove(req, res, next) {
        const id = req.params.id
        try {
            await jobs.remove(id, req.user?._id )
            res.ok({
                status: "success",
                message: `Job deleted`,
                statusCode: 204
            })
        } catch (error) {
           res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async getActivity(req, res, next) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        try {
            const activity = await jobs.activity(page,limit)
           return res.ok({
                status: "success",
                data: activity
            })
        } catch (err) {
           return res.fail({
                status: "fail",
                message: err.message
            })
        }
    },

    async scrape(req, res) {

        const { searchTag, q, posted, expires } = req.body;
        const allowedContractTypes = ["full-time", "contract","internship","part-time","gig"]


        try {
            const scraper = require("../utils/automations/scraper")
            let jobArray = await scraper.scrapeJobsIndeed({
                searchTag,
                q
            })
            jobArray = jobArray.map((scrapedJob) => {
                let insertJobObj = {}
                if (scrapedJob.posted * 1 > 5) {
                    insertJobObj.title = scrapedJob.title;
                    insertJobObj.company = scrapedJob.company;
                    insertJobObj.exp = "N/A";
                    insertJobObj.location = `${scrapedJob.location}`;
                    insertJobObj.workplaceType = scrapedJob.workplaceType || "onsite";
                    insertJobObj.contractType = allowedContractTypes.includes(scrapedJob.type?.toLowerCase()) ?  scrapedJob.type?.toLowerCase() : "full-time";
                    insertJobObj.datePosted = new Date();
                    insertJobObj.expiryDate = new Date(insertJobObj.datePosted);
                    insertJobObj.expiryDate.setDate(insertJobObj.datePosted.getDate() + expires);
                    insertJobObj.link = scrapedJob.link || "https://ng.indeed.com";
                    insertJobObj.poster = scrapedJob.poster;
                    insertJobObj.uploader_id = "65174f32bf8a942899880d45"
                }
                if (insertJobObj && JSON.stringify(insertJobObj) !== '{}'  ) return insertJobObj;
            }).filter((insertJobObj) => insertJobObj && JSON.stringify(insertJobObj) !== '{}');
            const jobScraped = await jobs.createScrapedJobs({ uniqueJobsArray: jobArray})
            res.ok({
                    status: "success",
                    data: jobScraped,
                    statusCode: 201
                })
        } catch (err) {
            res.fail({
                    status: "fail",
                    message: err.message
                })
        }
    },


}