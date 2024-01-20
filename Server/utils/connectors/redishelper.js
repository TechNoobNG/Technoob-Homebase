const { createClient } = require('redis');
const config = require('../../config/config')
const REDIS_URL = config.REDIS_URL;

const client = createClient({
    url: REDIS_URL
})

const redisSubscriber = client.duplicate();

module.exports = {
    client,
    redisSubscriber
}