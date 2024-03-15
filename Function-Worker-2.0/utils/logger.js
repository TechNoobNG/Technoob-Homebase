const axios = require('axios').default;
const env = process.env.NODE_ENV || 'development';
const config = require(`./config`)[env];

const technoob = axios.create({
    baseURL: config.LIVE_BASE_URL || 'https://api.technoob.tech',
    headers: {
        "Authorization": `Bearer ${config.HONEYBADGER_KEY}`,
        "Content-Type": "application/json"
    }
});

module.exports = {
    async createScrapeLog({ searchTags, age, platform, scrapeResultLog, status }) {
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
            console.error(error.message);
        }
    },
};
