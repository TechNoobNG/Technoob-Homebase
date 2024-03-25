
const { getSlackNotificationModuleDefaults,createFieldsBlock, emailStreamToObject, fetchExternalLinkAndUploadToS3, convertRichTextToHtml } = require("../../utils/utils");
const { sendRequest, respondToAction, openModal, sendMessageToUser } = require("../../utils/slack/index");
const config = require("../../config/config");
const { autogenerateURL } = require("../../utils/storage/storageService");

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

async function notifyActionResponseV2({  trigger_id, slackPayload, modal_identifier }) {
    try {
        let respPayload = {
            trigger_id,
            view: slackPayload,
            modal_identifier
        }
        const resp = await openModal(respPayload)
        return resp.data
    } catch (error) {
        throw error;
    }
}

async function notifyActionResponseNoError({ text, responseUrl, messageBlock, isSuccessful,thread_ts }) {
    try {
        let slackPayload;
        const originalMessageBlock = messageBlock
        if (isSuccessful) {
            //hide buttons from original message block
            const { payload} = getSlackNotificationModuleDefaults({
                moduleType: "notifyScrapedJobApprovalResponseRender",
                fields: null,
                image: null,
                activityTag: null,
                originalMessageBlock,
                text,
                isSuccessful
            })
            const  { sectionBlock, fieldsBlock, actionsBlock,responseTextBlock }  = payload
            slackPayload = {
                "blocks": [sectionBlock, fieldsBlock, actionsBlock, responseTextBlock].filter((comp) => {
                    if (comp) {
                        return comp
                    }
                })
            }; 
        } else {
            //re-render original message block with error
            const { payload } = getSlackNotificationModuleDefaults({
                moduleType: "notifyScrapedJobApprovalResponseRender",
                fields: null,
                image: null,
                activityTag: null,
                originalMessageBlock,
                text,
                isSuccessful: false
            })
            const  { sectionBlock, fieldsBlock, actionsBlock,responseTextBlock }  = payload
            slackPayload = {
                "blocks": [sectionBlock, fieldsBlock, actionsBlock,responseTextBlock].filter((comp) => {
                    if (comp) {
                        return comp
                    }
                })
            };
        }
        let respPayload = {
            responseUrl,
            payload: slackPayload,
            replace_original: true,
            thread_ts
        }
        if (thread_ts) {
            respPayload.replace_original = false
            respPayload.response_type = "in_channel"
        }
        const resp = await respondToAction(respPayload)
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

function retrieveCommandFunction(name) {
    if (!name) {
        return null
    }
    if (name === "renderEmailPlaceholdersModal") {
        return renderEmailPlaceholdersModal
    }
    if (name === "renderCreateMailingListModal") {
        return renderCreateMailingListModal
    }
    if (name === "viewmailinglist") {
        return viewmailinglist
    }
    return null
}

const divider = {
    "type": "divider"
}

async function renderEmailPlaceholdersModal({identifier,username}) {
    try {
        if (!identifier) {
            throw new Error("Provide an identifier to identify the template to be used")
        }
        const emailModel = require('../../models/email_templates');
        const email = await emailModel.findOne({
            $or: [
                {
                    name: identifier
                },
                {
                    id: identifier
                }
            ]
        })
        if (!email) {
            throw new Error(`${identifier} not found`)
        }
        const emailPlaceholders = email.placeholders;

        const inputBlockArray = emailPlaceholders.map((placeholder) => {
            if (placeholder.isImage) {
                return  {
                    "type": "input",
                    "label": {
                        "type": "plain_text",
                        "text":  `${placeholder.name}`,
                        "emoji": true
                    },
                    "element": {
                        "type": "file_input",
                        "filetypes": ["jpg", "png", "gif"],
                        "max_files": 1,
                    },
                    "optional": placeholder.isRequired ? false : true
                }
            }
            if (placeholder.isContent) {
                return {
                    "type": "input",
                    "element": {
                        "type": "rich_text_input",
                    },
                    "label": {
                        "type": "plain_text",
                        "text": `${placeholder.name}`,
                        "emoji": true
                    }
                }
            }
            if (placeholder.isUrl) {
                return {
                    "type": "input",
                    "element": {
                      "type": "url_text_input",
                    },
                    "label": {
                        "type": "plain_text",
                        "text": `${placeholder.name}`,
                        "emoji": true
                    }
                  }
                  
            }
            return  {
                "type": "input",
                "label": {
                    "type": "plain_text",
                    "text": `${placeholder.name}`,
                    "emoji": true
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": true
                },
                "optional": placeholder.isRequired ? false : true
            }
        })

        const subject = {
            "type": "input",
            "label": {
                "type": "plain_text",
                "text": `Email Subject`,
                "emoji": true
            },
            "element": {
                "type": "plain_text_input",
                "multiline": true
            },
            "optional": false
        }

        const subjectTitle = {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "The email Subject"
                }
            ]
        }

        const placeHolderTitle = {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "Placeholders to be replaced "
                }
            ]
        }

        const promptSectionBlock = {
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": `:wave: Hey ${username.split('.')[0]}!\n\n The email template provided requires some placeholders`,
				"emoji": true
			}
        }
    

        const slackPayload = {
            "type": "modal",
            "callback_id": "renderEmailPlaceholdersModal",
            "title": {
                "type": "plain_text",
                "text": `${email.name}`,
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Render Email",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [promptSectionBlock, subjectTitle, divider, subject, placeHolderTitle,divider, ...inputBlockArray]
        };

        slackPayload.private_metadata = JSON.stringify({
            selectedTemplate: email.name,
            module: "sendemailwithtemplate"
        });

        return {
            slackPayload,
            modal_identifier: "renderEmailPlaceholdersModal"
        }
    } catch (error) {
        throw error;
    }
}

async function renderCreateMailingListModal({team_domain,username, user_id}) {
    try {
       
        const inputBlockArray = [
            {
                "type": "input",
                "label": {
                    "type": "plain_text",
                    "text": "Name",
                    "emoji": true
                },
                "element": {
                    "type": "plain_text_input",
                    "multiline": false
                },
                "optional":  false
            },
            {
                "type": "input",
                "label": {
                    "type": "plain_text",
                    "text":  `Mailing List (CSV File)`,
                    "emoji": true
                },
                "element": {
                    "type": "file_input",
                    "filetypes": ["csv"],
                    "max_files": 1,
                },
                "optional": false
            }
        ]

        const promptSectionBlock = {
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": `:wave: Hey ${username.split('.')[0]}!\n\n Kindly provide the name of the mailing list and upload the csv file`,
				"emoji": true
			}
        }
    

        const slackPayload = {
            "type": "modal",
            "callback_id": "renderCreateMailingListModal",
            "title": {
                "type": "plain_text",
                "text": `Create Mailing List`,
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Preview List",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [promptSectionBlock,divider, ...inputBlockArray]
        };

        slackPayload.private_metadata = JSON.stringify({
            team_domain,
            uploaderId: user_id,
            module: "addmailinglistwithcsv"
        });


        return {
            slackPayload,
            modal_identifier: "renderCreateMailingListModal"
        }
    } catch (error) {
        throw error;
    }
}

function buildQueryString(params) {
    const queryString = Object.keys(params)
        .map(key => params[key] !== undefined && params[key] !== null ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}` : "")
        .join('&');
    const fieldsMap = Object.keys(params).map((key) => {
        if(!params[key]) return
        return {
            label: key,
            value: params[key]
        }
    }).filter(Boolean)
    return {
        queryString,
        fieldsMap
    };
}

async function previewMailingList(body) {
    try {
        const { view: { blocks, title, state, private_metadata } } = body;
        let inputs = {};
        if (Array.isArray(blocks)) {
            blocks.forEach((block) => {
                if (block && block.type === "input") {
                    if (state.values[block.block_id][block.element.action_id].type === "file_input") {
                        inputs[block.label?.text] = state.values[block.block_id][block.element.action_id].files || [];
                    }
                    if (state.values[block.block_id][block.element.action_id].type === "plain_text_input") {
                        inputs[block.label?.text] = state.values[block.block_id][block.element.action_id].value || "";
                    }
                    if (state.values[block.block_id][block.element.action_id].type === "url_text_input") {
                        inputs[block.label?.text] = state.values[block.block_id][block.element.action_id].value || "";
                    }
                    
                }
            })
        }
        for (const key of Object.keys(inputs)) {
            if (key.toLowerCase().includes("csv file") && Array.isArray(inputs[key]) && inputs[key].length) {
                const csvUrl = inputs[key][0].url_private_download;
                const csvName = `${inputs[key][0].created}_${inputs[key][0].name}`;
                const contentType = inputs[key][0].mimetype;
    
                setTimeout(async (csvUrl,csvName,contentType) => {
                    await fetchExternalLinkAndUploadToS3({
                        url: csvUrl,
                        name: csvName,
                        source: 'slack',
                        contentType: contentType,
                        isFile: true,
                        acl: "public"
                    })
                }, 50, csvUrl, csvName, contentType)
                const url = await autogenerateURL({
                    type:  contentType.split("/")[1],
                    name: csvName,
                    acl: "public"
                })
                inputs[key] = url
            }

        }

        const promptSectionBlock = {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `:wave: Kindly review the information to be uploaded.`
			}
        }

        const fieldsMap =  Object.keys(inputs).map((key) => {
            if(!inputs[key]) return
            return {
                label: key,
                value: inputs[key]
            }
        }).filter(Boolean)
        
        const placehOlderFieldBlock = createFieldsBlock(fieldsMap,null)

        const slackPayload = {
            type: "modal",
            callback_id: "previewMailingList",
            title: {
                type: "plain_text",
                text: `Step 2/2`
            },
            submit: {
                type: "plain_text",
                text: "Add",
                emoji: true
            },
            close: {
                type: "plain_text",
                text: "Cancel",
                emoji: true
            },
            blocks: [promptSectionBlock,divider,placehOlderFieldBlock]
        };
        

        if (private_metadata && Object.keys(inputs).length !== 0) {
            const prev = JSON.parse(private_metadata);
            const newMeta = JSON.stringify({ ...prev, ...inputs })
            slackPayload.private_metadata = newMeta
        }

        return {
            slackPayload,
            modal_identifier: "previewMailingList"
        }

    } catch (error) {
        throw error;
    }
}

async function renderEmailPreview(body) {
    try {
        const { view: { blocks, title, state, private_metadata } } = body;
        let placeHolders = {}
        if (Array.isArray(blocks)) {
            blocks.forEach((block) => {
                if (block && block.type === "input") {
                    if (state.values[block.block_id][block.element.action_id].type === "file_input") {
                        placeHolders[block.label?.text] = state.values[block.block_id][block.element.action_id].files || [];
                    }
                    if (state.values[block.block_id][block.element.action_id].type === "plain_text_input") {
                        placeHolders[block.label?.text] = state.values[block.block_id][block.element.action_id].value || "";
                    }
                    if (state.values[block.block_id][block.element.action_id].type === "rich_text_input") {
                        placeHolders[block.label?.text] = convertRichTextToHtml(state.values[block.block_id][block.element.action_id].rich_text_value.elements) || "";
                    }
                    if (state.values[block.block_id][block.element.action_id].type === "url_text_input") {
                        placeHolders[block.label?.text] = state.values[block.block_id][block.element.action_id].value || "";
                    }
                    
                }
            })
        }

        let queryString = ''
        let fieldsMap = []

        if (Object.keys(placeHolders).length !== 0) {
            const placeholderKeys = Object.keys(placeHolders);

            for (const key of placeholderKeys) {
                if (key.toLowerCase().includes("image") && Array.isArray(placeHolders[key]) && placeHolders[key].length) {
                    const imageUrl = placeHolders[key][0].url_private_download;
                    const imageName = `${placeHolders[key][0].created}_${placeHolders[key][0].name}`;
                    const contentType = placeHolders[key][0].mimetype;
        
                    setTimeout(async (imageUrl,imageName,contentType) => {
                        await fetchExternalLinkAndUploadToS3({
                            url: imageUrl,
                            name: imageName,
                            source: 'slack',
                            contentType: contentType,
                            isFile: true,
                            acl: "public"
                        })
                    }, 50, imageUrl, imageName, contentType)
                    const url = await autogenerateURL({
                        type:  contentType.split("/")[1],
                        name: imageName,
                        acl: "public"
                    })
                    placeHolders[key] = url
                    //placeHolders[key] = encodeURIComponent(placeHolders[key])
                }
            }
            let buildQuery= buildQueryString(placeHolders);
            fieldsMap = buildQuery.fieldsMap;
            queryString = buildQuery.queryString;

        }

        const promptSectionBlock = {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `:wave: Kindly use this link to preview the email content <https://${config.LIVE_BASE_URL}/api/v1/admin/email/preview/${title.text}?${queryString}|here>`
			}
        }
        
        const placehOlderFieldBlock = createFieldsBlock(fieldsMap,null)

        const slackPayload = {
            type: "modal",
            callback_id: "renderEmailPreview",
            title: {
                type: "plain_text",
                text: `Step 2/3`
            },
            submit: {
                type: "plain_text",
                text: "Select Recipients",
                emoji: true
            },
            close: {
                type: "plain_text",
                text: "Cancel",
                emoji: true
            },
            blocks: [promptSectionBlock,divider,placehOlderFieldBlock]
        };

        if (private_metadata && Object.keys(placeHolders).length !== 0) {
            const prev = JSON.parse(private_metadata);
            const newMeta = JSON.stringify({ ...prev, placeHolders })
            slackPayload.private_metadata = newMeta
        }
        
        return {
            slackPayload,
            modal_identifier: "renderEmailPreview"
        }

    } catch (error) {
        throw error;
    }
}

async function renderInputRecepientsModal(body) {
    try {
        const {step,  view: { blocks, title, state, private_metadata }, team } = body;
        const pickMailingListSectionBlock = {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Pick a mailing list`
            },
            "accessory": {
                "action_id": `mailing_list:${team.domain}`,
                "type": "external_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select a mailing list"
                },
                "min_query_length": 2,
                "focus_on_load": true
            }
        }

        const slackPayload = {
            type: "modal",
            callback_id: "renderInputRecepientsModal",
            title: {
                type: "plain_text",
                text:`Step 3/3`
            },
            submit: {
                type: "plain_text",
                text: "Confirm Details",
                emoji: true
            },
            close: {
                type: "plain_text",
                text: "Cancel",
                emoji: true
            },
            blocks: [pickMailingListSectionBlock]
        };

        if (private_metadata) {
            slackPayload.private_metadata = private_metadata
        }
        return {
            slackPayload,
            modal_identifier: "renderEmailPreview"
        }
    } catch (error) {
        throw error;
    }
}

async function viewmailinglist(body) {
    try {
        const {team_domain: team } = body;
        const pickMailingListSectionBlock = {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Select a mailing list to preview. A link will be generated for you to download as a csv file`
            },
            "accessory": {
                "action_id": `mailing_list:${team}`,
                "type": "external_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select a mailing list to preview."
                },
                "min_query_length": 2,
                "focus_on_load": true
            }
        }

        const slackPayload = {
            type: "modal",
            callback_id: "viewmailinglist",
            title: {
                type: "plain_text",
                text:`Select Mailing List`
            },
            submit: {
                type: "plain_text",
                text: "Download List",
                emoji: true
            },
            close: {
                type: "plain_text",
                text: "Cancel",
                emoji: true
            },
            blocks: [pickMailingListSectionBlock]
        };

        slackPayload.private_metadata = JSON.stringify({
            module: "viewmailinglist"
        })
        
        return {
            slackPayload,
            modal_identifier: "viewmailinglist"
        }
    } catch (error) {
        throw error;
    }
}

async function previewSubmission(body) {
    try {
        const { view: { blocks, title, state, private_metadata } } = body;

        const prev_metadata = JSON.parse(private_metadata)
        const placeHolders = prev_metadata.placeHolders;
        let buildQuery = buildQueryString(placeHolders);
        let queryString = buildQuery.queryString;
        const fieldsMap = buildQuery.fieldsMap;
        const placehOlderFieldBlock = createFieldsBlock(fieldsMap, null)
        
        const selectedMailingGroup = state.values[blocks[0].block_id][blocks[0].accessory.action_id].selected_option.value;
        const owner = blocks[0].accessory.action_id.split(":")[1]
        const { message } = await renderMailingListInfo({
            groupName: selectedMailingGroup,
            owner
        })

        const slackPayload = {
            type: "modal",
            callback_id: "previewSubmission",
            title: {
                type: "plain_text",
                text:`Content Preview`
            },
            submit: {
                type: "plain_text",
                text: "Confirm Details",
                emoji: true
            },
            close: {
                type: "plain_text",
                text: "Cancel",
                emoji: true
            },
            blocks: [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": ":tada: You're all set! This is your request summary."
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": "Placeholders to be replaced"
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                placehOlderFieldBlock,
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": ":m: Recipients Summary"
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": message
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": " Email Preview link"
                        }
                    ]
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `:wave: Kindly use this link to preview the email content <https://${config.LIVE_BASE_URL}/api/v1/admin/email/preview/${prev_metadata.selectedTemplate}?${queryString}|here>`
                    }
                }
            ]
        };

        const new_metadata = {
            ...prev_metadata, groupName:selectedMailingGroup,owner
        }
        slackPayload.private_metadata = JSON.stringify(new_metadata)

        return {
            slackPayload,
            modal_identifier: "previewSubmission"
        }
    } catch (error) {
        throw error
    }
}

async function processSubmission(body) {
    try {
        const { view: { blocks, title, state, private_metadata,callback_id }, user } = body;
        const processingData = JSON.parse(private_metadata);


        if (processingData.module === "sendemailwithtemplate") {
            const { sendEmailToMailingList } = require("../admin");
            processingData.source = "slack"
            processingData.user = user
            processingData.subject = processingData.placeHolders["Email Subject"];
            delete processingData.placeHolders["Email Subject"];
            await sendEmailToMailingList(processingData)
        }

        if(processingData.module === "renderEmailBlocksModal"){
            let responseObject = {};
            if (Array.isArray(blocks)) {
                blocks.forEach((block) => {
                    if (block && block.type === "input") {
                        responseObject[block.label?.text] = state.values[block.block_id][block.element.action_id].type === "file_input" ? state.values[block.block_id][block.element.action_id].files :state.values[block.block_id][block.element.action_id].value;
                    }
                })
            }
            const payload = {
                source: "slack",
                user,
                adminResponse: responseObject,
                emailInfo: processingData,

            }

            const { respondToEmail } = require("../admin");
            await respondToEmail(payload)
        }

        if (processingData.module === "addmailinglistwithcsv") {
            const { createMailingListCSV } = require("../admin");
            processingData.name = processingData.Name.trim().split(" ").join("_");
            delete processingData.Name;
            processingData.url = processingData["Mailing List (CSV File)"]
            delete processingData["Mailing List (CSV File)"]
            processingData.source = "slack"
            processingData.user = user
            processingData.owner = processingData.team_domain
            delete processingData.team_domain
            await createMailingListCSV(processingData)
        }

        if (processingData.module === "viewmailinglist") {
            const selectedMailingGroup = state.values[blocks[0].block_id][blocks[0].accessory.action_id].selected_option.value;
            const { generateMailingListCSVDownloadUrl } = require("../admin");
            processingData.source = "slack"
            processingData.userId = user.id
            processingData.groupName = selectedMailingGroup
            processingData.user = user
            await generateMailingListCSVDownloadUrl(processingData)
        }
        
        return {
            "response_action": "clear"
          }
    } catch (error) {
        throw error
    }
}

function servicePicker({ moduleType, reaction  }) {
    const { approveScrapedJob, rejectScrapedJob } = require("../jobs");
    const moduleActionsServiceMap = {
        notifyScrapedJobApproval: {
            approve_scraped_jobs: approveScrapedJob,
            remove_scraped_jobs: rejectScrapedJob
        },
        mailing_list: renderMailingListInfo,
        handleSesEmail: {
            replyEmail: replySesEmail,
            markEmailAsRead: markSesEmailAsRead,
            deleteEmail: deleteSesEmail
        }
    }
    return moduleActionsServiceMap[moduleType]?.[reaction] || null;
}

async function markSesEmailAsRead({ }) {
    
}

async function deleteSesEmail({ }) {
    
}

async function replySesEmail({ activityTag, userInfo }) {
    try {
        const { getObjectStream } = require("../../utils/storage/aws_storage");
        const tagSplit = activityTag.split("/");
        const bucket = tagSplit[0];
        const key = tagSplit[1];
        const {body} = await getObjectStream({
            Bucket: bucket,
            Key: key
        })
        const parsedContent = await emailStreamToObject(body);

        const resp = await renderEmailBlocksModal({
            from: parsedContent.from.text,
            message: parsedContent.text,
            references: parsedContent.references,
            recievedEmailMessageId: parsedContent.messageId || parsedContent.inReplyTo ,
            subject: parsedContent.inReplyTo || parsedContent.references?.length ? parsedContent.subject : `Re: ${parsedContent.subject}`,
            bucket,
            userInfo,
            key
        })

        return resp
    } catch (error) {
        throw error
    }
}


async function renderEmailBlocksModal({ from, message,userInfo, bucket,key,recievedEmailMessageId,references,subject  }) {
    try {

        const titleSection = {
            "type": "section",
            "block_id": "reply_input_section",
            "text": {
                "type": "mrkdwn",
                "text": `Reply to ${from}`
            }
        };
        
        const messageBlock = {
			"type": "section",
			"block_id": "original_message_section",
			"text": {
				"type": "mrkdwn",
				"text": `Original Message:\n ${message.substring(0, 2000)} [Clipped for brevity]`
			}
		}

        const ccBlock = {
			"type": "input",
			"label": {
				"type": "plain_text",
				"text": "CC",
				"emoji": true
			},
			"element": {
				"type": "plain_text_input",
				"multiline": false,
				"placeholder": {
					"type": "plain_text",
					"text": "cc@email.com, another_cc@email.com"
				}
			},
			"optional": true
        }
        
        const bccBlock = {
			"type": "input",
			"label": {
				"type": "plain_text",
				"text": "BCC",
				"emoji": true
			},
			"element": {
				"type": "plain_text_input",
				"multiline": false,
				"placeholder": {
					"type": "plain_text",
					"text": "bcc@email.com, another_bcc@email.com"
				}
			},
			"optional": true
		}

        const messageInputBlock = {
			"type": "input",
			"label": {
				"type": "plain_text",
				"text": "Response",
				"emoji": true
			},
			"element": {
				"type": "plain_text_input",
				"multiline": true,
				"placeholder": {
					"type": "plain_text",
					"text": "Your email response"
				}
			},
			"optional": false
		}

        const attachmentBlock = {
			"type": "input",
			"label": {
				"type": "plain_text",
				"text": "Attachment",
				"emoji": true
			},
			"element": {
				"type": "file_input"
			},
			"optional": true
		}


        const slackPayload = {
            "type": "modal",
            "callback_id": "renderEmailBlocksModal",
            "title": {
                "type": "plain_text",
                "text": "Reply To",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Reply",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [titleSection,messageBlock,ccBlock,bccBlock, messageInputBlock, attachmentBlock]
        };

        slackPayload.private_metadata = JSON.stringify({
            module: "renderEmailBlocksModal",
            bucket,
            key,
            from,
            userInfo,
            references,
            recievedEmailMessageId,
            subject
        });

        return {
            slackPayload,
            modal_identifier: "renderEmailBlocksModal"
        };
    } catch (error) {
        throw error;
    }
}


function servicePickerExternalSource({ activityTag  }) {
    const moduleActionsServiceMap = {
        mailing_list: renderMailingListInfo
    }
    return moduleActionsServiceMap[activityTag] || null;
}

async function renderMailingListInfo({ groupName,owner, }) {
    try {
        const mailingList = require("../../models/mailing_list");
        const groupId = `${owner}:${groupName}`
        const retrieveEmails = await mailingList.find({
            groupId
        })
        return {
            message: `You selected your "${groupName}" list. The list has a total of ${retrieveEmails.length} emails.`,

        }
    } catch (err) {
        throw err
    }
}

const commandMap = {
    "/sendemailwithtemplate": {
        requiresText: true,
        responseHandler: {
            argsCount: 1,
            requiredArgsCount: 1,
            name: "renderEmailPlaceholdersModal",
            argsValidator: null,
            modal_identifier: "renderEmailPlaceholdersModal",
            invalidArgsCountMessage: `This command requires you to provide the template name or ID. It should be in this format. *\\/\\renderEmailPlaceholdersModal invite_admin* . \n Where invite_admin is the template name or ID`,
            argsBuilder: (body) => {
                const args = body.text.split("0");
                return {
                    identifier: args[0],
                    username: body.user_name
                }
            },
            stepsCount: 3
        },
        enabled: true
    },
    "/createmailinglist": {
        requiresText: true,
        responseHandler: {
            argsCount: 0,
            requiredArgsCount: 0,
            name: "renderCreateMailingListModal",
            argsValidator: null,
            modal_identifier: "renderCreateMailingListModal",
            invalidArgsCountMessage: `Invalid Request`,
            stepsCount: 2,
            argsBuilder: (body) => {
                return {
                    team_domain: body.team_domain,
                    user_id: body.user_id,
                    username: body.user_name
                }
            },
        },
        enabled: true
    },
    "/viewmailinglist": {
        requiresText: false,
        responseHandler: {
            argsCount: 0,
            requiredArgsCount: 0,
            name: "viewmailinglist",
            argsValidator: null,
            modal_identifier: "viewmailinglist",
            invalidArgsCountMessage: `Invalid Request`,
            stepsCount: 2,
            argsBuilder: (body) => {
                return {
                    team_domain: body.team_domain,
                    user_id: body.user_id,
                    username: body.user_name
                }
            },
        },
        enabled: true
    }
}

const stepOrder = new Map([
    ["renderEmailPlaceholdersModal", "renderEmailPreview"],
    ["renderEmailPreview", "renderInputRecepientsModal"],
    ["renderInputRecepientsModal", "previewSubmission"],
    ["previewSubmission", "processSubmission"],
    ["renderEmailBlocksModal", "processSubmission"],
    ["renderCreateMailingListModal", "previewMailingList"],
    ["previewMailingList", "processSubmission"],
    ["viewmailinglist", "processSubmission"]
])

const stepMap = {
    renderEmailPlaceholdersModal,
    renderEmailPreview,
    renderInputRecepientsModal,
    previewSubmission,
    processSubmission,
    renderEmailBlocksModal,
    renderCreateMailingListModal,
    previewMailingList,
    viewmailinglist
}

async function nextStepPickerRunner(body) {
    const nextStep = stepOrder.get(body.view.callback_id);
    if (nextStep) {
        return await stepMap[nextStep](body);
    } else {
        return "done"
    } 
}

async function processAction({ body }) {
    try {
        const { type, callback_id,actions  } = body;
        if (!body) {
            throw new Error("No interaction body provided")
        }
        if (type === "block_actions" ) {
            const { activityTag, moduleType, reaction } = moduleExtractor({ action: actions[0] });
            const userInfo = body.user;
            const reactionService = await servicePicker({ moduleType, reaction });
            const runReaction = await reactionService({ activityTag, userInfo });
            if (runReaction.slackPayload) {
                return {
                    message: runReaction.message,
                    slackPayload: runReaction.slackPayload,
                    modal_identifier: runReaction.modal_identifier
                }
            }
            return {
                message: runReaction?.message || "Run successfully"
            }
        } else if (type === "view_submission") {
            const { message, slackPayload, modal_identifier } = await nextStepPickerRunner(body);
            return {
                message,
                slackPayload,
                modal_identifier
            }
            
        } else {
            throw new Error(` Type is not configured`)
        }

    } catch (error) {
        console.log(error)
        throw new Error(`Failed to run: ${error.message || error}`)
    }
}

function optionsRender(ops) {
    const optionsDropdown = ops.map((op) => {
        return {
            "text": {
                "type": "plain_text",
                "text": op.text
            },
            "value": op.value
        }
    }) || []
    return optionsDropdown
} 
const menuRenderRunner = {
    mailing_list: async function ({action_id, value}) {
        try {
            const mailingList = require('../../models/mailing_list_grouping');
            const owner = action_id.split(":")[1];
            const list = await mailingList.find(
                {
                    groupName: { $regex: value, $options: 'i' },
                    owner
                }
            )
            if (list && !list.length) {
                return optionsRender([])
            }
            const options = list.map((each) => {
                return {
                    text: each.groupName,
                    value: each.groupName
                  }
              })
            return optionsRender(options)
        } catch (error) {
            throw error
        }
    }
}

async function fetchMenus({ body }) {
    try {
        const { type, callback_id , action_id, value} = body;
        if (!body) {
            throw new Error("No interaction body provided")
        }
        if (type === 'block_suggestion') {
            const menuModule = action_id.split(":")[0];
            const renderMenu  = await menuRenderRunner[menuModule](body);
            return {
                options: renderMenu
            }
            
        } else {
            return {
                options: []
            }
        }

    } catch (error) {
        throw new Error(`Failed to run: ${error.message || error}`)
    }
}

async function actWithSlackUpdate(data) {
    try {
        if (data.moduleName === "BulkStaticEmailWithSlackUpdate") {
            const emailService = require("../../utils/mailer/mailBuilder");
            const runMailer = await emailService.sendToMany(data.mailOptions)
            if (runMailer.success) {
                const emailStatusNotificationRender = renderEmailStatusNotification(runMailer)
                await notifySlackProcessUpdate({
                    block: emailStatusNotificationRender,
                    user: data.user
                })
            }
        }

        if (data.moduleName === "AddToMailingListCSVWithSlackUpdate") {
            const adminService = require("../../services/admin");
            try {
                const runAct = await adminService.addToMailingListCSV(data.setupData)
                if ( runAct && runAct.length) {
                    const runStatusRenderBlock = runActStatusRender({
                        result: {
                            completed: true,
                            success: true,
                            message: `Successfully added ${runAct.emails.length} emails to ${runAct.groupId.split(':')[1]}  with groupId ${runAct.groupId}`
                        },
                        actionModule: "AddMailingList",
                        act: "Mailing list"
                    })
                    await notifySlackProcessUpdate({
                        block: runStatusRenderBlock,
                        user: data.user
                    })
                }
            } catch (error) {
                const runStatusRenderBlock = runActStatusRender({
                    result: {
                        completed: false,
                        success: false,
                        message: `Failed to add emails ${error.message}`
                    },
                    actionModule: "AddMailingList",
                    act: "Mailing list"
                })
                await notifySlackProcessUpdate({
                    block: runStatusRenderBlock,
                    user: data.user
                })
            }
        }

        if (data.moduleName === "GenerateMailingListCSVDownloadUrlWithSlackUpdate") {
            const adminService = require("../../services/admin");
            try {
                const runAct = await adminService.generateMailingListCSVDownloadUrl(data.setupData)
                if ( runAct && runAct.length) {
                    const runStatusRenderBlock = runActStatusRender({
                        result: {
                            completed: true,
                            success: true,
                            message: `Hi ${data.user.name}, you requested access to the ${data.setupData?.groupName} mailing list.`,
                            downloadUrl: runAct,
                        },
                        actionModule: "GenerateMailingListUrl",
                        act: "Fetched Mailing List"
                    })
      
                    await notifySlackProcessUpdate({
                        block: runStatusRenderBlock,
                        user: data.user
                    })
                }
            } catch (error) {
                const runStatusRenderBlock = runActStatusRender({
                    result: {
                        completed: false,
                        success: false,
                        message: `Failed to fetch the mailing list requested`
                    },
                    actionModule: "GenerateMailingListUrl",
                    act: "Fetched Mailing List"
                })
                await notifySlackProcessUpdate({
                    block: runStatusRenderBlock,
                    user: data.user
                })
            }
        }

    } catch (error) {
        throw new Error(`Failed to run: ${error.message || error}`)
    }
}

async function notifySlackProcessUpdate({ block,user }) {
    try {
        const userId = user.id;
        const channelId = user.team_id;
        const sendMessage = await sendMessageToUser({ userId, channelId, block });
        return {
            message: sendMessage || "Notified user"
        }

    } catch (error) {
        throw error
    }
}

function renderEmailStatusNotification(result) {
    try {
        const successEmoji = result.success ? ":white_check_mark:" : ":x:";

        const blocks = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `${successEmoji} *Email Status*`
                }
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `*Success:* ${result.success}\n*Message:* ${result.message}`
                    }
                ]
            },
            {
                type: "divider"
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `${successEmoji} *Successful Recipients*`
                },
                fields: result.successful.map((email) => ({
                    type: "mrkdwn",
                    text: `• ${email}`
                }))
            }
        ];

        return { blocks };
    } catch (error) {
        throw error;
    }
}

function runActStatusRender({result, actionModule, act}) {
    try {
        let successEmoji = result.completed ? ":white_check_mark:" : ":x:";

        let blocks = [];

        if (actionModule === "AddMailingList") {
            blocks = [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `${successEmoji} *${act} Status*`
                    }
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: `*Success:* ${result.success}\n*Message:* ${result.message}`
                        }
                    ]
                },
                {
                    type: "divider"
                }
            ];
        }

        if (actionModule === "GenerateMailingListUrl") {
            blocks = [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `${successEmoji} *${act} Status*`
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `:smile: ${result.message}`
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `:wave: Kindly use this link to download the mailing list as a csv file <https://${result.downloadUrl}|here>`
                    }
                },
                {
                    type: "divider"
                }
                
            ];
        }

        return { blocks };
    } catch (error) {
        throw error;
    }
}
module.exports = {
    notifySlack,
    moduleTypeCreator,
    notifyActionResponse,
    processAction,
    notifyActionResponseNoError,
    retrieveCommandFunction,
    notifyActionResponseV2,
    commandMap,
    fetchMenus,
    actWithSlackUpdate,
    viewmailinglist
}