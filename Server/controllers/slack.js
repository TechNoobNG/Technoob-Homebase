const slack = require('../services/integrations/slack');

async function processAction({ body }) {
    let processedAction
    try {
        processedAction = await slack.processAction({ body });
    } catch (error) {
        console.error(error.message);
        processedAction = {
            message: error.message
        } 
    }

    try {
        await slack.notifyActionResponseNoError({
            text: processedAction.message,
            responseUrl: body.response_url,
            messageBlock: null
        });
    } catch (error) {}
}

module.exports = {
    async action(req, res) {
        const body = req.body;
        try {
            if (!body) {
                throw new Error("Invalid request body");
            }

            console.log(body);
            console.log(req.headers)
            setTimeout(() => processAction({ body }), 1000);

            res.ok({
                status: "success",
                message: "Action received",
                statusCode: 200
            });
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            });
        }
    },
};
