const config = require('../utils/config')['production'];
const q = config.SCRAPER_QUANTITY;
const posted = config.SCRAPER_OLDEST_JOB_FETCH || 4;
const expires = config.SCRAPED_JOBS_EXPIRES;

const { deleteExpiredJobs,scrapeJobs,scrapeJobsV2 } = require("../Jobs/index")
module.exports = async function (context, req) {
   let responseMessage = `Triggered Succesfully`
    try {
        await scrapeJobsV2();
        await scrapeJobs(q, posted, expires, context);
    } catch (error) {
        responseMessage = `Triggered Failed`
    }
    context.res = {
        status: 200,
        body: responseMessage
    };
}