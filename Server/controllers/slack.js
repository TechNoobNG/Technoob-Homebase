const { processAction, notifyActionResponseNoError,commandMap, fetchMenus, notifyActionResponseV2, retrieveCommandFunction} = require('../services/integrations/slack');
const { openModal } = require("../utils/slack/index")
async function process({ body }) {
    let processedAction
    try {
        processedAction = await processAction({ body });
        processedAction.successful = true
    } catch (error) {
        processedAction = {
            message: error.message,
            successful: false
        } 
    }

    try {
        if (processedAction.message && !processedAction.slackPayload && !processedAction.modal_identifier) {
            await notifyActionResponseNoError({
                text: processedAction.message,
                responseUrl: body.response_url,
                messageBlock: body.message.blocks,
                isSuccessful: processedAction.successful,
                thread_ts: body.container.message_ts
            });
        } else if (processedAction.slackPayload || processedAction.modal_identifier) {
            let resp = {
                "response_action": "update",
                "view": processedAction.slackPayload,
            }

            // console.log("pushing p",processedAction)
            // resp.view.callback_id = processedAction.modal_identifier
            return resp
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    async action(req, res) {
        const reqBody = req.body;
        try {
            if (!reqBody || !reqBody.payload) {
                throw new Error("Invalid request body");
            }
            const parsedBody = JSON.parse(reqBody.payload)
            if (parsedBody.type === "block_actions" && parsedBody.actions[0].type !== "external_select") {

                res.ok({
                    status: "success",
                    message: "Action received",
                    statusCode: 200
                })
                const resp = await process({ body: parsedBody })
                if (resp.response_action) {
                    await openModal({
                        view: resp.view,
                        trigger_id: parsedBody.trigger_id
                    })
                }
               
            } else if (parsedBody.type === "block_actions" && parsedBody.actions[0].type === "external_select") {
                res.ok({
                    status: "success",
                    message: "Action received",
                    statusCode: 200
                })
            } else if (parsedBody.type === "view_submission") {
                const resp = await process({ body: parsedBody })
                res.status(200).send( resp );   
            }
        } catch (error) {
            console.log(error)
            res.fail({
                status: "fail",
                message: error.message
            });
        }
    },
    async commands(req, res) {
        const body = req.body;
        try {
            const command = body.command;
            if (!body || !command || !commandMap[command]) {
                throw new Error(`"${command}" is not a valid command. Please contact your admin`)
            }

            if (!commandMap[command].enabled) {
                throw new Error(`"${command}" is disabled. Please contact your admin`)
            }
            const argsCount = body.text.split(" ").length;
            if (argsCount > commandMap[command].responseHandler.argsCount || argsCount < commandMap[command].responseHandler.requiredArgsCount) {
                throw new Error(`${commandMap[command].responseHandler.invalidArgsCountMessage || "Invalid arguments provided"}`)
            }

            res.slackok({
                data: {
                    "response_type": "in_channel"
                }
            })

            const commandToRun = retrieveCommandFunction(commandMap[command].responseHandler.name);
            const { slackPayload } = await commandToRun(commandMap[command].responseHandler.argsBuilder(body));
            
          
            await notifyActionResponseV2({
                trigger_id: body.trigger_id,
                slackPayload,
                modal_identifier: commandMap[command].responseHandler.modal_identifier
            });


        } catch (error) {
            res.slackfail(error.message)
        }
    },

    async menus(req, res) {
        const reqBody = req.body;
        try {
            if (!reqBody || !reqBody.payload) {
                throw new Error("Invalid request body");
            }
            const parsedBody = JSON.parse(reqBody.payload);
            const resp = await fetchMenus({body:parsedBody})
            res.status(200).json(resp)
        } catch (error) {
            res.status(404).json([])
        }
    }
};
