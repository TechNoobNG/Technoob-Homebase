
const { getSlackNotificationModuleDefaults } = require("../../utils/utils");
const { sendRequest, respondToAction } = require("../../utils/slack/index");
 /**
     * @function notifySlack
     * @param {object} { moduleType, notificationData,image }
     * @returns {object} { message }
     * @throws {Error} 
     */
 async function notifySlack ({ moduleType, notificationData,image,activityTag }) {
    try {
        const fields = Object.keys(notificationData).map((key) => {
            return {
                label: key.replace("_"," "),
                value: notificationData[key]
            }
        })

        const { slackPayload, channel} = moduleTypeCreator({
            moduleType,
            fields,
            image,
            activityTag
        })
        await sendRequest({
            body: slackPayload,
            webhook: {
                channel: channel
            }
        })
        return {
            message: `Notified ${channel}`
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

function moduleTypeCreator({ moduleType,image,fields, activityTag}) {
    try {

        const { payload, channel } = getSlackNotificationModuleDefaults({
            moduleType,fields,image,activityTag
        })
        
        const { sectionBlock, fieldsBlock, actionsBlock  } = payload
        const slackPayload = {
            "blocks": [sectionBlock, fieldsBlock, actionsBlock]
        };
        return {
            slackPayload,
            channel: channel
        };
    } catch (error) {
        throw error;
    }
}

async function notifyActionResponse({ text, responseUrl,messageBlock }) {
    try {
        const resp = await respondToAction({
            responseUrl,
            text,
            messageBlock,
            replace_original: true
        })
        return resp
    } catch (error) {
        throw error;
    }
}

async function notifyActionResponseNoError({ text, responseUrl,messageBlock }) {
    try {
        const resp = await respondToAction({
            responseUrl,
            text,
            messageBlock,
            replace_original: true
        })
        return resp
    } catch (error) {
        console.error(`Notify Action Response Error:${error.message || error}`)
    }
}


function moduleExtractor({ action }) {
    const delimiterSeperation = action?.value?.split(":");
    const activityTag = delimiterSeperation[0];
    const moduleType = delimiterSeperation[1];
    const reaction = delimiterSeperation[2]

    return {
        activityTag,
        moduleType,
        reaction
    }
}

function servicePicker({ moduleType, reaction  }) {
    const { approveScrapedJob, rejectScrapedJob } = require("../jobs");
    const moduleActionsServiceMap = {
        notifyScrapedJobApproval: {
            approve_scraped_jobs: approveScrapedJob,
            remove_scraped_jobs: rejectScrapedJob
        }
    }
    return moduleActionsServiceMap[moduleType]?.[reaction] || null;
}


async function processAction({ body }) {
    try {
        if (!body) {
            throw new Error("No interaction body provided")
        }
        const { activityTag, moduleType, reaction } = moduleExtractor({ action: body.actions[0] });
        const userInfo = body.user;
        const reactionService = await servicePicker({ moduleType, reaction });
        const runReaction = await reactionService({activityTag,userInfo});
        return {
            message: runReaction?.message || "Run successfully"
        }
    } catch (error) {
        throw new Error(`Failed to run: ${error.message}`)
    }
}
module.exports = {
    notifySlack,
    moduleTypeCreator,
    notifyActionResponse,
    processAction,
    notifyActionResponseNoError
}