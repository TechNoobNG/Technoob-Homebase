
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
        LIVE_BASE_URL: process.env.LIVE_BASE_URL || 'http://technoobstaging-env.eba-izgw9fe4.eu-west-2.elasticbeanstalk.com',
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
                "http://127.0.0.1:3000",
                "https://www.technoob.tech",
                "http://technoobstaging.s3-website.eu-west-2.amazonaws.com",
                "http://staging.technoob.tech"

            ],
        SCRAPE_STACK_KEYWORDS: process.env.SCRAPE_STACK_KEYWORDS ? JSON.parse(process.env.SCRAPE_STACK_KEYWORDS) :
            [
                "junior product ui/ux designer",
                "junior product project manager scrum master",
                "junior cloud devops engineer",
                "junior backend software mobile frontend developer",
                "junior QA",
                "Junior customer Service support"
            ],
        AVAILABLE_STACKS:  [
            "Frontend Development",
            "UI/UX",
            "Backend Development",
            "Mobile Development",
            "Product Management",
            "Project Management",
            "Technical Writing",
            "Cloud Development",
            "Cybersecurity",
            "Software Testing",
            "DevOps",
            "SEO"
        ],
        WORKER_LOG_BATCH_SIZE: process.env.WORKER_LOG_BATCH_SIZE || 10,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_REGION: process.env.AWS_REGION,
        AWS_QUEUE_URL: process.env.AWS_QUEUE_URL,
        WORKER_QUEUE_PLATFORM: process.env.WORKER_QUEUE_PLATFORM || 'azure',
        REDIS_URL: process.env.REDIS_URL,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        EXCLUDE_CLEAR_CACHE_ROUTES: process.env.EXCLUDE_CLEAR_CACHE_ROUTES ? JSON.parse(process.env.EXCLUDE_CLEAR_CACHE_ROUTES) :
            [
                '/api/v1/authenticate',
                '/api/v1/admin/invite',
                '/api/v1/admin/remove',
                '/api/v1/admin/contact-us',
                '/api/v1/admin/mailing-list'
            ],
        MAX_LOGIN_ATTEMPT: process.env.MAX_LOGIN_ATTEMPT || 3,
    },
    test: {
        NODE_ENV: "test"
    },

    production: {
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
                "https://technoob.tech",
                "https://www.technoob.tech",
                "http://technoob.tech",
                "http://www.technoob.tech",
                "technoob-78121a48c9b8.herokuapp.com",
            ],
        SCRAPE_STACK_KEYWORDS: process.env.SCRAPE_STACK_KEYWORDS ? JSON.parse(process.env.SCRAPE_STACK_KEYWORDS) :
            [
                "junior product ui/ux designer",
                "junior product project manager scrum master",
                "junior cloud devops engineer",
                "junior backend software mobile frontend developer",
                "junior QA",
                "Junior customer Service support"
            ],
        AVAILABLE_STACKS:  [
            "Frontend Development",
            "UI/UX",
            "Backend Development",
            "Mobile Development",
            "Product Management",
            "Project Management",
            "Technical Writing",
            "Cloud Development",
            "Cybersecurity",
            "Software Testing",
            "DevOps",
            "SEO"
        ],
        WORKER_LOG_BATCH_SIZE: process.env.WORKER_LOG_BATCH_SIZE || 10,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_REGION: process.env.AWS_REGION,
        AWS_QUEUE_URL: process.env.AWS_QUEUE_URL,
        WORKER_QUEUE_PLATFORM: process.env.WORKER_QUEUE_PLATFORM || 'azure',
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        EXCLUDE_CLEAR_CACHE_ROUTES: process.env.EXCLUDE_CLEAR_CACHE_ROUTES ? JSON.parse(process.env.EXCLUDE_CLEAR_CACHE_ROUTES) :
            [
                '/api/v1/authenticate',
                '/api/v1/admin/invite',
                '/api/v1/admin/remove',
                '/api/v1/admin/contact-us',
                '/api/v1/admin/mailing-list'
            ],
            MAX_LOGIN_ATTEMPT: process.env.MAX_LOGIN_ATTEMPT || 3,
    },

    production_worker: {
            NODE_ENV: process.env.NODE_ENV,
            UV_THREADPOOL_SIZE: OS.cpus().length,
            DATABASE_URL: process.env.DATABASE_URL,
            PORT: process.env.PORT || 3000,
            JWT_SECRET: process.env.JWT_SECRET,
            JWT_EXPIRES: process.env.JWT_EXPIRES,
            JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
            SALT_ROUNDS: process.env.SALT_ROUNDS * 1 || 12,
            TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME || '10m',
            SESSION_SECRET: process.env.SESSION_SECRET,
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
                    "http://localhost:3000"
                ],
            SCRAPE_STACK_KEYWORDS: process.env.SCRAPE_STACK_KEYWORDS ? JSON.parse(process.env.SCRAPE_STACK_KEYWORDS) :
                [
                "junior product ui/ux designer",
                "junior product project manager scrum master",
                "junior cloud devops engineer",
                "junior backend software mobile frontend developer",
                "junior QA",
                "Junior customer Service support"
            ],
        LISTENER: process.env.LISTENER || true,
        AVAILABLE_STACKS:  [
            "Frontend Development",
            "UI/UX",
            "Backend Development",
            "Mobile Development",
            "Product Management",
            "Project Management",
            "Technical Writing",
            "Cloud Development",
            "Cybersecurity",
            "Software Testing",
            "DevOps",
            "SEO"
        ],
        WORKER_LOG_BATCH_SIZE: process.env.WORKER_LOG_BATCH_SIZE || 10,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_REGION: process.env.AWS_REGION,
        AWS_QUEUE_URL: process.env.AWS_QUEUE_URL,
        WORKER_QUEUE_PLATFORM: process.env.WORKER_QUEUE_PLATFORM || 'azure',
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        EXCLUDE_CLEAR_CACHE_ROUTES: process.env.EXCLUDE_CLEAR_CACHE_ROUTES ? JSON.parse(process.env.EXCLUDE_CLEAR_CACHE_ROUTES) :
            [
                '/api/v1/authenticate'
            ],
    }
}
