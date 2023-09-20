
require('dotenv').config();
const OS = require('os');

module.exports = {
    development: {
        NODE_ENV: process.env.NODE_ENV,
        UV_THREADPOOL_SIZE: OS.cpus().length,
        DATABASE_URL: process.env.DATABASE_URL,
        PORT: process.env.PORT || 3000,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES: process.env.JWT_EXPIRES,
        JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
        SALT_ROUNDS: process.env.SALT_ROUNDS * 1 || 12,
        TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME || '10m',
        SESSION_SECRET: process.env.SESSION_SECRET || 'technoob',
        HOST: OS.hostname(),
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
        COMMUNICATION_SERVICES_CONNECTION_STRING: process.env.COMMUNICATION_SERVICES_CONNECTION_STRING,
        LIVE_BASE_URL: process.env.LIVE_BASE_URL || 'technoob-staging.azurewebsites.net',
        HONEYBADGER_KEY: process.env.HONEYBADGER_KEY,
        AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
        AZURE_QUEUE_NAME: process.env.AZURE_QUEUE_NAME,
        AZURE_QUEUE_URL: process.env.AZURE_QUEUE_URL,
        REQUEST_LIMIT: process.env.REQUEST_LIMIT || 500,
        SCRAPER_QUANTITY: process.env.SCRAPER_QUANTITY || 10,
        SCRAPED_JOBS_EXPIRES: process.env.SCRAPED_JOBS_EXPIRES || 7,
        SCRAPER_OLDEST_JOB_FETCH: process.env.SCRAPER_OLDEST_JOB_FETCH || 3,
        SENDER_EMAIL_ADDRESS: process.env.SENDER_EMAIL_ADDRESS || "DoNotReply@technoob.tech",
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? JSON.parse(process.env.ALLOWED_ORIGINS) :
            [
                "http://localhost:3000",
                "https://technoob-client-staging.herokuapp.com",
                "https://technoob-client.herokuapp.com",
                "http://127.0.0.1:3000",
                "https://technoob-staging.azurewebsites.net",
                "https://technoob.tech",
                "https://www.technoob.tech",
                "http://technoob.tech",
                "http://www.technoob.tech",
                "technoob-78121a48c9b8.herokuapp.com",
                "https://technoob-78121a48c9b8.herokuapp.com"
            ],
        SCRAPE_STACK_KEYWORDS: process.env.SCRAPE_STACK_KEYWORDS ? JSON.parse(process.env.SCRAPE_STACK_KEYWORDS) :
        [
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
        
    },
    test: {
        NODE_ENV: "test"
    },

    production: {
        NODE_ENV: "production",

    },
};

