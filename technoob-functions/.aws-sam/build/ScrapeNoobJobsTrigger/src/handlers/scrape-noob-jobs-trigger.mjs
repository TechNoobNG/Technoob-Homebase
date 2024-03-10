import config from '../utils/config.js';
import { scrapeJobs, scrapeJobsV2 } from '../Jobs/index.js';

const q = config.SCRAPER_QUANTITY;
const posted = config.SCRAPER_OLDEST_JOB_FETCH || 4;
const expires = config.SCRAPED_JOBS_EXPIRES;

export const scrapeNoobJobs = async (event, context) => {
    try {
        await scrapeJobs(q, posted, expires);
        await scrapeJobsV2();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Scraping completed successfully' }),
        };
    } catch (err) {
        console.error(err);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
