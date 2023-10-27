const config = require('../utils/config')['production'];
const q = config.SCRAPER_QUANTITY;
const posted = config.SCRAPER_OLDEST_JOB_FETCH || 4;
const expires = config.SCRAPED_JOBS_EXPIRES;

const { deleteExpiredJobs,scrapeJobs } = require("../Jobs/index")
const honeybadger = require('../utils/honeybadger');

module.exports = async function (context, myTimer) {
    context.log('Timer function processed request.');
    try {
        honeybadger.notify({
                name: "Trigger Job scraping",
                message: myTimer
        })
    await scrapeJobs(q,posted,expires,context);
    } catch (err) {
        context.log(err)
        honeybadger.notify({
            name: "Initiated Job scraping",
            message: err
    })
    }
};