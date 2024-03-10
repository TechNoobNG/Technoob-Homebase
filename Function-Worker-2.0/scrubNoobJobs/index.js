const config = require('../utils/config')['production'];
const q = config.SCRAPER_QUANTITY;
const posted = config.SCRAPER_OLDEST_JOB_FETCH || 4;
const expires = config.SCRAPED_JOBS_EXPIRES;

const { deleteExpiredJobs,scrapeJobs,scrapeJobsV2 } = require("../Jobs/index")

module.exports = async function (context, myTimer) {
    context.log('Timer function processed request.');
    try {
        await scrapeJobs(q, posted, expires, context);
        await scrapeJobsV2();
    } catch (err) {
        context.log(err)
    }
};