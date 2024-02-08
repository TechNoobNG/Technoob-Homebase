
require('dotenv').config();
const OS = require('os');
const env = process.env.NODE_ENV || 'development';
const environments = {
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
        AZURE_STORAGE_ACCOUNT_KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY,
        COMMUNICATION_SERVICES_CONNECTION_STRING: process.env.COMMUNICATION_SERVICES_CONNECTION_STRING,
        LIVE_BASE_URL: process.env.LIVE_BASE_URL || 'staging-api.technoob.tech',
        HONEYBADGER_KEY: process.env.HONEYBADGER_KEY,
        AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
        AZURE_QUEUE_NAME: process.env.AZURE_QUEUE_NAME,
        AZURE_QUEUE_URL: process.env.AZURE_QUEUE_URL,
        REQUEST_LIMIT: process.env.REQUEST_LIMIT || 500,
        SCRAPER_QUANTITY: process.env.SCRAPER_QUANTITY || 10,
        SCRAPED_JOBS_EXPIRES: process.env.SCRAPED_JOBS_EXPIRES || 7,
        SCRAPER_OLDEST_JOB_FETCH: process.env.SCRAPER_OLDEST_JOB_FETCH || 3,
        SENDER_EMAIL_ADDRESS: process.env.SENDER_EMAIL_ADDRESS || "no-reply@technoob.tech",
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? JSON.parse(process.env.ALLOWED_ORIGINS) :
            [
                "http://localhost:3000",
                "https://localhost:3000",
                "http://127.0.0.1:3000",
                "https://technoobstaging.s3-website.eu-west-2.amazonaws.com",
                "staging-api.technoob.tech",
                "http://staging.technoob.tech",
                "https://localhost:3000",
                "https://staging.technoob.tech"
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
            "SEO",
            "Product Design"
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
                '/api/v1/admin/mailing-list',
                '/api/v1/slack'
            ],
        MAX_LOGIN_ATTEMPT: process.env.MAX_LOGIN_ATTEMPT || 3,
        WORKER_BATCH_SIZE: process.env.WORKER_BATCH_SIZE || 5,
        USE_CORS: process.env.USE_CORS,
        NUMBER_OF_PROXIES: process.env.NUMBER_OF_PROXIES || 1,
        MAIL_PROVIDER: {
            provider: process.env.MAIL_PROVIDER || 'ses',
            useMultiple: process.env.MAIL_PROVIDER_USE_MULTIPLE,
        },
        STORAGE_PROVIDER: {
            provider: process.env.STORAGE_PROVIDER || 'azure',
            useMultipleProviders: process.env.STORAGE_PROVIDER_USE_MULTIPLE_PROVIDERS,
        },
        AWS_SERVICES: {
            SQS: {
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                queueUrl: process.env.AWS_QUEUE_URL
            },
            SES: {
                region: "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            S3: {
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        },
        SMART_PROXY_KEY: process.env.SMART_PROXY_KEY,
        SLACK: {
            CHANNELS: {
                DEV_TESTING: {
                    WEBHOOK: process.env.DEV_TESTING_WEBHOOK ,
                    WEBHOOK_TOKEN: process.env.DEV_TESTING_WEBHOOK_TOKEN ,
                    CHANNEL_ID: process.env.DEV_TESTING_CHANNEL_ID ,
                },
                ADMIN_REVIEW: {
                    WEBHOOK: process.env.ADMIN_REVIEW_WEBHOOK ,
                    WEBHOOK_TOKEN: process.env.ADMIN_REVIEW_WEBHOOK_TOKEN ,
                    CHANNEL_ID: process.env.ADMIN_REVIEW_CHANNEL_ID ,
                },
            },
            BASE_URL:  process.env.SLACK_BASE_URL || "https://hooks.slack.com/services",
            WORKSPACE_ID: process.env.WORKSPACE_ID ,
            SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
            BOT_USER_OAUTH_TOKEN: process.env.SLACK_BOT_USER_OAUTH_TOKEN ,
            API_BASE_URL: process.env.SLACK_API_BASE_URL || "https://slack.com/api"
        },
        LAMBDA: {
            SIGNING_SECRET: process.env.LAMBDA_SIGNING_SECRET || "your_lambda_signing_secret_here"
        }

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
        SENDER_EMAIL_ADDRESS: process.env.SENDER_EMAIL_ADDRESS || "no-reply@technoob.tech",
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
            "SEO",
            "Product Design"
        ],
        WORKER_LOG_BATCH_SIZE: process.env.WORKER_LOG_BATCH_SIZE || 10,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_REGION: process.env.AWS_REGION,
        AWS_QUEUE_URL: process.env.AWS_QUEUE_URL,
        WORKER_QUEUE_PLATFORM: process.env.WORKER_QUEUE_PLATFORM || 'azure',
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        REDIS_URL: process.env.REDIS_URL,
        EXCLUDE_CLEAR_CACHE_ROUTES: process.env.EXCLUDE_CLEAR_CACHE_ROUTES ? JSON.parse(process.env.EXCLUDE_CLEAR_CACHE_ROUTES) :
            [
                '/api/v1/authenticate',
                '/api/v1/admin/invite',
                '/api/v1/admin/remove',
                '/api/v1/admin/contact-us',
                '/api/v1/admin/mailing-list',
                '/api/v1/slack'
            ],
        MAX_LOGIN_ATTEMPT: process.env.MAX_LOGIN_ATTEMPT || 3,
        WORKER_BATCH_SIZE: process.env.WORKER_BATCH_SIZE || 5,
        USE_CORS: process.env.USE_CORS,
        NUMBER_OF_PROXIES: process.env.NUMBER_OF_PROXIES || 1,
        MAIL_PROVIDER: {
            provider: process.env.MAIL_PROVIDER || 'ses',
            useMultiple: process.env.MAIL_PROVIDER_USE_MULTIPLE
        },
        STORAGE_PROVIDER: {
            provider: process.env.STORAGE_PROVIDER || 'aws',
            useMultipleProviders: process.env.STORAGE_PROVIDER_USE_MULTIPLE_PROVIDERS,
        },
        AWS_SERVICES: {
            SQS: {
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                queueUrl: process.env.AWS_QUEUE_URL
            },
            SES: {
                region: "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            S3: {
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        },
        SMART_PROXY_KEY: process.env.SMART_PROXY_KEY,
        SLACK: {
            CHANNELS: {
                DEV_TESTING: {
                    WEBHOOK: process.env.DEV_TESTING_WEBHOOK ,
                    WEBHOOK_TOKEN: process.env.DEV_TESTING_WEBHOOK_TOKEN ,
                    CHANNEL_ID: process.env.DEV_TESTING_CHANNEL_ID ,
                },
                ADMIN_REVIEW: {
                    WEBHOOK: process.env.ADMIN_REVIEW_WEBHOOK ,
                    WEBHOOK_TOKEN: process.env.ADMIN_REVIEW_WEBHOOK_TOKEN ,
                    CHANNEL_ID: process.env.ADMIN_REVIEW_CHANNEL_ID ,
                },
            },
            BASE_URL:  process.env.SLACK_BASE_URL || "https://hooks.slack.com/services",
            WORKSPACE_ID: process.env.WORKSPACE_ID ,
            SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
            BOT_USER_OAUTH_TOKEN: process.env.SLACK_BOT_USER_OAUTH_TOKEN ,
            API_BASE_URL: process.env.SLACK_API_BASE_URL || "https://slack.com/api"
        },
        LAMBDA: {
            SIGNING_SECRET: process.env.LAMBDA_SIGNING_SECRET
        }
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
        SENDER_EMAIL_ADDRESS: process.env.SENDER_EMAIL_ADDRESS || "no-reply@technoob.tech",
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? JSON.parse(process.env.ALLOWED_ORIGINS) :
            [
                "http://localhost:3000"
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
        LISTENER: process.env.LISTENER,
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
            "SEO",
            "Product Design"
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
                '/api/v1/slack/action'
            ],
        USE_CORS: process.env.USE_CORS ,
        MAIL_PROVIDER: {
            provider: process.env.MAIL_PROVIDER || 'ses',
            useMultiple: process.env.MAIL_PROVIDER_USE_MULTIPLE
        },
        STORAGE_PROVIDER: {
            provider: process.env.STORAGE_PROVIDER || 'aws',
            useMultipleProviders: process.env.STORAGE_PROVIDER_USE_MULTIPLE_PROVIDERS,
        },
        AWS_SERVICES: {
            SQS: {
                region: process.env.AWS_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                queueUrl: process.env.AWS_QUEUE_URL
            },
            SES: {
                region: "eu-north-1",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        },
        SMART_PROXY_KEY: process.env.SMART_PROXY_KEY,
        SLACK: {
            CHANNELS: {
                DEV_TESTING: {
                    WEBHOOK: process.env.DEV_TESTING_WEBHOOK ,
                    WEBHOOK_TOKEN: process.env.DEV_TESTING_WEBHOOK_TOKEN ,
                    CHANNEL_ID: process.env.DEV_TESTING_CHANNEL_ID ,
                },
                ADMIN_REVIEW: {
                    WEBHOOK: process.env.ADMIN_REVIEW_WEBHOOK ,
                    WEBHOOK_TOKEN: process.env.ADMIN_REVIEW_WEBHOOK_TOKEN ,
                    CHANNEL_ID: process.env.ADMIN_REVIEW_CHANNEL_ID ,
                },
            },
            BASE_URL:  process.env.SLACK_BASE_URL || "https://hooks.slack.com/services",
            WORKSPACE_ID: process.env.WORKSPACE_ID ,
            SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
            BOT_USER_OAUTH_TOKEN: process.env.SLACK_BOT_USER_OAUTH_TOKEN ,
            API_BASE_URL: process.env.SLACK_API_BASE_URL || "https://slack.com/api"
        }
    }
}
module.exports = environments[env]
