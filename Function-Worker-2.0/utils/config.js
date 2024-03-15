
require('dotenv').config();

module.exports = {
    development: {
        NODE_ENV: process.env.NODE_ENV,
        AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
        COMMUNICATION_SERVICES_CONNECTION_STRING: process.env.COMMUNICATION_SERVICES_CONNECTION_STRING,
        LIVE_BASE_URL: process.env.LIVE_BASE_URL || 'https://staging-api.technoob.tech',
        HONEYBADGER_KEY: process.env.HONEYBADGER_KEY,
        AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
        AZURE_QUEUE_NAME: process.env.AZURE_QUEUE_NAME,
        AZURE_QUEUE_URL: process.env.AZURE_QUEUE_URL,
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
                "junior product designer",
                "junior ui/ux designer",
                "junior product manager",
                "junior project manager",
                "junior scrum master",
                "junior cloud engineer",
                "junior devops engineer",
                "junior backend",
                "junior frontend",
                "junior android developer",
                "junior ios developer",
                "junior software engineer",
                "junior QA",
                "Junior customer Service",
                "Junior customer support",
                "intern product designer",
                "intern ui/ux designer",
                "intern product manager",
                "intern project manager",
                "intern scrum master",
                "intern cloud engineer",
                "intern devops engineer",
                "intern backend",
                "intern frontend",
                "intern android developer",
                "intern ios developer",
                "intern software engineer",
                "intern QA",
                "intern customer Service",
                "intern customer support",
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
        AWS_SERVICES: {
            SQS: {
                region: "eu-west-2",
                accessKeyId: process.env.ACCESS_KEY_ID_AWS || process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS || process.env.AWS_SECRET_ACCESS_KEY,
                queueUrl: process.env.AWS_QUEUE_URL
            },
            SES: {
                region: "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            S3: {
                region: "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        },

    },
    test: {
        NODE_ENV: "test"
    },

    production: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        PORT: process.env.PORT || 3000,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES: process.env.JWT_EXPIRES,
        JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
        SALT_ROUNDS: process.env.SALT_ROUNDS * 1 || 12,
        TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME || '10m',
        SESSION_SECRET: process.env.SESSION_SECRET || 'technoob',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
        COMMUNICATION_SERVICES_CONNECTION_STRING: process.env.COMMUNICATION_SERVICES_CONNECTION_STRING,
        LIVE_BASE_URL: process.env.LIVE_BASE_URL || 'https://api.technoob.tech',
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
            "junior product designer",
            "junior ui/ux designer",
            "junior product manager",
            "junior project manager",
            "junior scrum master",
            "junior cloud engineer",
            "junior devops engineer",
            "junior backend",
            "junior frontend",
            "junior android developer",
            "junior ios developer",
            "junior software engineer",
            "junior QA",
            "Junior customer Service",
            "Junior customer support",
            "intern product designer",
            "intern ui/ux designer",
            "intern product manager",
            "intern project manager",
            "intern scrum master",
            "intern cloud engineer",
            "intern devops engineer",
            "intern backend",
            "intern frontend",
            "intern android developer",
            "intern ios developer",
            "intern software engineer",
            "intern QA",
            "intern customer Service",
            "intern customer support",
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
        AWS_SERVICES: {
            SQS: {
                region: "eu-west-2",
                accessKeyId: process.env.ACCESS_KEY_ID_AWS || process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS || process.env.AWS_SECRET_ACCESS_KEY,
                queueUrl: process.env.AWS_QUEUE_URL
            },
            SES: {
                region: "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            S3: {
                region: "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        },

    },

    production_worker: {
            NODE_ENV: process.env.NODE_ENV,
            DATABASE_URL: process.env.DATABASE_URL,
            PORT: process.env.PORT || 3000,
            JWT_SECRET: process.env.JWT_SECRET,
            JWT_EXPIRES: process.env.JWT_EXPIRES,
            JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
            SALT_ROUNDS: process.env.SALT_ROUNDS * 1 || 12,
            TOKEN_EXPIRATION_TIME: process.env.TOKEN_EXPIRATION_TIME || '10m',
            SESSION_SECRET: process.env.SESSION_SECRET,
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
            AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
            COMMUNICATION_SERVICES_CONNECTION_STRING: process.env.COMMUNICATION_SERVICES_CONNECTION_STRING,
            LIVE_BASE_URL: process.env.LIVE_BASE_URL || 'https://api.technoob.tech',
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
        AWS_SERVICES: {
            SQS: {
                region: "eu-west-2",
                accessKeyId: process.env.ACCESS_KEY_ID_AWS || process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS || process.env.AWS_SECRET_ACCESS_KEY,
                queueUrl: process.env.AWS_QUEUE_URL
            },
            SES: {
                region: "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            S3: {
                region: "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        },
    }
}