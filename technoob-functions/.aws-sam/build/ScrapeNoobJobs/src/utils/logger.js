import axios from 'axios';
import  config from './config.js';

const technoob = axios.create({
    baseURL: config.LIVE_BASE_URL || 'https://staging-api.technoob.tech',
    headers: {
        "Authorization": `Bearer ${config.HONEYBADGER_KEY}`,
        "Content-Type": "application/json"
    }
});

export async function createScrapeLog({ searchTags, age, platform, scrapeResultLog, status }) {
    try {
        const response = await technoob.post("/api/v1/utils/scraper/logs", {
            searchTags: searchTags,
            age: age,
            platform: platform,
            scrapeResultLog: scrapeResultLog,
            status: status
        });
        console.log(response.data);
    } catch (error) {
        // Handle errors
        console.log("--------",error);
    }
}
