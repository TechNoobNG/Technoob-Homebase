const slack = require('../services/integrations/slack');

async function processAction({ body }) {
    let processedAction
    console.log(body)
    console.log("--------", typeof body)
    try {
        processedAction = await slack.processAction({ body });
        processedAction.successful = true
    } catch (error) {
        processedAction = {
            message: error.message,
            successful: false
        } 
    }

    try {
        await slack.notifyActionResponseNoError({
            text: processedAction.message,
            responseUrl: body.response_url,
            messageBlock: body.message.blocks,
            isSuccessful: processedAction.successful,
            thread_ts: body.container.message_ts
        });
    } catch (error) {
        console.error(error,processedAction)
    }
}

module.exports = {
    async action(req, res) {
        const reqBody = req.body;
        try {
            if (!reqBody || !reqBody.payload) {
                throw new Error("Invalid request body");
            }

            setTimeout(() => {
                res.ok({
                    status: "success",
                    message: "Action received",
                    statusCode: 200
                });
            }, 200)
            await processAction({ body: reqBody.payload })

            // res.ok({
            //     status: "success",
            //     message: "Action received",
            //     statusCode: 200
            // });
            // console.log(req.body)
            
        } catch (error) {
            console.log(error)
            res.fail({
                status: "fail",
                message: error.message
            });
        }
    },
};
