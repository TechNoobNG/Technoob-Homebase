
const scraperLog = require("../utils/scraperLog")
module.exports = {

    async deleteExpiredJobs(context) {
        try {
            const queue = require('../utils/aws_queue');
            await queue.sendMessage({
                name: "deleteExpiredJobs",
                import: "../services/jobs",
                method: "deleteExpiredJobs"
           })
        } catch (err) {
            context.log(err)
            throw err
        }
    },

    async scrapeJobs(q, posted, expires,context) {
        try {
            const queue = require('../utils/aws_queue');
            const config = require('../utils/config')['production'];
            const automations = require('../automations/scraper')
            const stackKeywords = config.SCRAPE_STACK_KEYWORDS || [
                "junior product designer",
                "junior ui/ux designer",
                "junior product manager",
                "junior project manager",
                "junior scrum master",
                "junior cloud engineer",
                "junior devops engineer",
                "junior backend",
                "junior frontend",
                "junior android developer",
                "junior ios developer",
                "junior software engineer",
                "junior QA",
                "Junior customer Service",
                "Junior customer support",
                "intern product designer",
                "intern ui/ux designer",
                "intern product manager",
                "intern project manager",
                "intern scrum master",
                "intern cloud engineer",
                "intern devops engineer",
                "intern backend",
                "intern frontend",
                "intern android developer",
                "intern ios developer",
                "intern software engineer",
                "intern QA",
                "intern customer Service",
                "intern customer support",
            ]
            const allowedContractTypes = ["full-time", "contract","internship","part-time","gig"]

            let result = []
            let insertJobObj = {}
            let dataUpload = []
            const scraperLogger = new scraperLog(stackKeywords,expires,"indeedNG")

            for (let keyword of stackKeywords) {

                try {
                    scraperLogger.start(keyword,"initiated")
                    result = await automations.scrapeJobsIndeed({
                    searchTag: keyword,
                        q: q * 1
                    })
                    scraperLogger.end(keyword,"completed")
                    result.forEach((scrapedJob) => {
                        if (scrapedJob.posted * 1 > 5) {
                            insertJobObj.title = scrapedJob.title;
                            insertJobObj.company = scrapedJob.company;
                            insertJobObj.exp = "N/A";
                            insertJobObj.location = `${scrapedJob.location}, Nigeria`;
                            insertJobObj.workplaceType = scrapedJob.workplaceType || "onsite";
                            insertJobObj.contractType = allowedContractTypes.includes(scrapedJob.type?.toLowerCase()) ?  scrapedJob.type?.toLowerCase() : "full-time";
                            insertJobObj.datePosted = new Date();
                            insertJobObj.expiryDate = new Date(insertJobObj.datePosted);
                            insertJobObj.expiryDate.setDate(insertJobObj.datePosted.getDate() + expires);
                            insertJobObj.link = scrapedJob.link || "https://ng.indeed.com";
                            insertJobObj.poster = scrapedJob.poster;
                            insertJobObj.uploader_id = "64feb85db96fbbd731c42d5f"
                        }
    
                        if (JSON.stringify(insertJobObj) !== '{}') dataUpload.push(insertJobObj);
                    });
                    let uniqueJobSet = new Set();
                    dataUpload.forEach((obj) => {
                        uniqueJobSet.add(JSON.stringify(obj));
                    });
                    let uniqueJobsArray = Array.from(uniqueJobSet, JSON.parse);
                    if (uniqueJobsArray.length) {
                        await queue.sendMessage({
                            name: "createScrapedJobs",
                            import: "../services/jobs",
                            method: "createScrapedJobs",
                            data: {
                                uniqueJobsArray
                            }
                    })}
                } catch (error) {
                    scraperLogger.end(keyword,"failed",error.message)
                    context.log(error)
                }

            }
            scraperLogger.complete();
        } catch (error) {
            context.log(error)
            throw error
        }

    },

    async scrapeJobsV2() {
        try {
            const queue = require('../utils/aws_queue');
            await queue.sendMessage({
                name: "scrapeNoobJobs",
                import: "../services/jobs",
                method: "scrapeNoobJobs"
           })
        } catch (err) {
            context.log(err)
            throw err
        }
    }


};