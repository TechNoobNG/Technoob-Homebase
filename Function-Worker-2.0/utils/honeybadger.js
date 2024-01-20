const config = require(`./config`);

module.exports = require('@honeybadger-io/js').configure({
    apiKey: config.HONEYBADGER_KEY,
    environment: env
});