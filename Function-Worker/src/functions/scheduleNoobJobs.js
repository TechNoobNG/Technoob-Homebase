const { app } = require('@azure/functions');
const { deleteExpiredJobs } = require("../../Jobs/index")
const honeybadger = require('../../../Server/utils/honeybadger');

console.log("running")
app.timer('scheduleNoobJobs', {
    schedule: '0 */1 * * * *',
    handler: async (myTimer, context) => {
        context.log('Timer function processed request.');
        honeybadger.notify({
            name: "Triggered Bi-daily Job",
            message: myTimer
       })
        try {
           await deleteExpiredJobs(context);
        } catch (err) {
            console.log(err)
            context.error(err)
            honeybadger.notify({
                name: "Failed To Trigger Bi-daily Job",
                message: err
           })
        }
    }
});
