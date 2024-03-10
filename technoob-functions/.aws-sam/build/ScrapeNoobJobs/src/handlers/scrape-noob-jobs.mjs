import config from '../utils/config.js';
const q = config.SCRAPER_QUANTITY;
const posted = config.SCRAPER_OLDEST_JOB_FETCH || 4;
const expires = config.SCRAPED_JOBS_EXPIRES;

import { deleteExpiredJobs,scrapeJobs,scrapeJobsV2 } from "../Jobs/index.js"


export const scrapeNoobJobs = async (event, context) => {
    try {
        await scrapeJobs(q, posted, expires);
        await scrapeJobsV2();
    } catch (err) {
        console.error(err)
    }

}
