const slack = require('../services/integrations/slack');

module.exports = {
    async action(req, res, next) {
        const body = req.body;
        try {
            if (!body) {
                throw new Error("Invalid request body")
            }
            res.ok({
                status: "success",
                message: `Request Recieved`
            })
            try {
                const processedAction = await slack.processAction({ body });
                await slack.notifyActionResponse({
                    text: processedAction.message,
                    responseUrl: body.response_url
                });
            } catch (error) {
                console.error(error)
                await slack.notifyActionResponse({
                    text: error.message,
                    responseUrl: body.response_url
                });
            }
           
        } catch (error) {
            return res.fail({
                status: "fail",
                message: error.message
            })
        }
    },
}