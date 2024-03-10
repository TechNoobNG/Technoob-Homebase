

const { deleteExpiredJobs } = require("../Jobs")
const honeybadger = require('../utils/honeybadger');

module.exports = async function (context, myTimer) {
    context.log('Timer function processed request.');
    try {
        await deleteExpiredJobs(context);
    } catch (err) {
        context.log(err)
    }
};