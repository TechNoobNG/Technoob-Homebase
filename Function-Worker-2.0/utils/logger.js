const axios = require('axios').default;
const env = process.env.NODE_ENV || 'development';
const config = require(`./config`)[env];

const apiClient = axios.create({
    baseURL: config.LIVE_BASE_URL || 'https://technoob-staging.azurewebsites.net',
    headers: {
        "Authorization": `Bearer ${config.production.HONEYBADGER_KEY}`,
        "Content-Type": "application/json"
    }
});

module.exports = {
    async createScrapeLog({ searchTags, age, platform, scrapeResultLog, status }) {
        try {
            const response = await apiClient.post("/api/v1/utils/scraper/logs", {
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
