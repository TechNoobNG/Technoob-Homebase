const { createClient } = require('redis');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const REDIS_URL = config.REDIS_URL;

const client = createClient({
    url: REDIS_URL
})

module.exports = client