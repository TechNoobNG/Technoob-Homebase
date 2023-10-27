

const { deleteExpiredJobs } = require("../Jobs")
const honeybadger = require('../utils/honeybadger');

module.exports = async function (context, myTimer) {
    context.log('Timer function processed request.');
    try {
        honeybadger.notify({
                name: "Triggered Bi-daily Job",
                message: myTimer
        })
    await deleteExpiredJobs(context);
    } catch (err) {
        context.log(err)
        honeybadger.notify({
            name: "Failed To Trigger Bi-daily Job",
            message: err
    })
    }
};