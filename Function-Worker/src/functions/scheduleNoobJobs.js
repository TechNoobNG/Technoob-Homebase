const { app } = require('@azure/functions');
const { deleteExpiredJobs } = require("../../Jobs/index")
const honeybadger = require('../../../Server/utils/honeybadger');

app.timer('scheduleNoobJobs', {
<<<<<<< HEAD
    schedule: '0 */1 * * * *',
=======
    schedule: '0 * */12 * * *',
>>>>>>> 3cd18c18cc6419bb478c6f9db5319c22b4478b19
    handler: async (myTimer, context) => {
        context.log('Timer function processed request.');
        honeybadger.notify({
            name: "Triggered Bi-daily Job",
            message: myTimer
       })
        try {
           await deleteExpiredJobs(context);
        } catch (err) {
            context.error(err)
            honeybadger.notify({
                name: "Failed To Trigger Bi-daily Job",
                message: err
           })
        }
    }
});
