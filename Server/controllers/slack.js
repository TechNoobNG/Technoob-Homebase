const slack = require('../services/integrations/slack');

module.exports = {
    async action(req, res, next) {
        const body = req.body;
        try {
            res.ok({
                status: "success",
                message: `Request Recieved`
            })
            try {
                const processedAction = await slack.processAction();
                await slack.notifyActionResponse({
                    text: processedAction.message,
                    responseUrl: body.response_url
                });
            } catch (error) {
                await slack.notifyActionResponse({
                    text: error.message,
                    responseUrl: body.response_url
                });
            }
           
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },
}