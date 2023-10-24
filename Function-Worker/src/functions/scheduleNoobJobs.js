const { app } = require('@azure/functions');

try {
    const config = require('../../../Server/config/config')['production'];
    const q = config.SCRAPER_QUANTITY;
    const posted = config.SCRAPER_OLDEST_JOB_FETCH || 4;
    const expires = config.SCRAPED_JOBS_EXPIRES;

    const { deleteExpiredJobs,scrapeJobs } = require("../../Jobs/index")
    const honeybadger = require('../../../Server/utils/honeybadger');

    app.timer('scheduleNoobJobs', {
        schedule: '0 0 * * * *',
        handler: async (myTimer, context) => {
            context.log('Timer function processed request.');
            try {
                honeybadger.notify({
                        name: "Triggered Bi-daily Job",
                        message: myTimer
                })
            await deleteExpiredJobs(context);
            } catch (err) {
                context.log(err)
                honeybadger.notify({
                    name: "Failed To Trigger Bi-daily Job",
                    message: err
            })
            }
        }
    });

    app.timer('scrubNoobJobs', {
        schedule: `0 30 12 */${posted} * *`,
        handler: async (myTimer, context) => {
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
        }
    });

    app.timer('scrubNoobJobsTest', {
        schedule: `0 */8 * * * *`,
        handler: async (myTimer, context) => {
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
        }
    });


} catch (error) {
    console.error(error)
}

