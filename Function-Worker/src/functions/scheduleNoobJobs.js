const { app } = require('@azure/functions');

console.log("running")
app.timer('scheduleNoobJobs', {
    schedule: '0 * */12 * * *',
    handler: async (myTimer, context) => {
        context.log('Timer function processed request.');
        console.log("Timer function processed request.")
        try {
            const { deleteExpiredJobs } = require("../../Jobs/index")
            const honeybadger = require('../../../Server/utils/honeybadger');
            honeybadger.notify({
                    name: "Triggered Bi-daily Job",
                    message: myTimer
            })
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
