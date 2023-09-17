

module.exports = {

    async deleteExpiredJobs(context) {
        try {
            const queue = require('../../Server/azure_Queue/init');
            const honeybadger = require('../../Server/utils/honeybadger');
         await queue.sendMessage({
                name: "deleteExpiredJobs",
                import: "../services",
                service: "jobs",
                method: "deleteExpiredJobs"
           })
            honeybadger.notify({
                name: "deleteExpiredJobs",
                message: "Initiated Delete Expired Jobs"
           })
        } catch (err) {
            context.log(err)
            throw err
        }
    },
    
    async scrapeJobs(q, posted, expires) {
        try {
            const queue = require('../../Server/azure_Queue/init');
            const honeybadger = require('../../Server/utils/honeybadger');
            const config = require('../../Server/config/config')['development'];
            const stackKeywords = config.SCRAPE_STACK_KEYWORDS || [
                "junior software developer",
                "junior product designer",
                "junior product manager",
                "junior project manager",
                "junior devops",
                "junior cloud engineer",
                "junior ui/ux designer",
                "junior backend developer",
                "junior QA",
                "junior mobile developer",
                "junior frontend developer",
                "Junior customer Service"
        ]
    
            for (let keyword of stackKeywords) {
                await queue.sendMessage({
                    name: "createScrapedJobs",
                    import: "../services",
                    service: "jobs",
                    method: "createScrapedJobs",
                    data: {
                        searchTag: keyword,
                        q,
                        posted,
                        expires
                    },
                    visibilityTimeout: 40,
                    delay: 3000
                })
            }
            honeybadger.notify({
                name: "createScrapedJobs",
                message: "Initiated Job scraping"
           })
        } catch (error) {
            context.log(err)
            throw err
        }


    }
};