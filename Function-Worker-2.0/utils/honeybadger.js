const config = require(`./config`);
const env = process.NODE_ENV
module.exports = require('@honeybadger-io/js').configure({
    apiKey: config.HONEYBADGER_KEY,
    environment: env
});