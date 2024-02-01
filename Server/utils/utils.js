
const config = require(`${__dirname}/../config/config.js`)
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = config.SALT_ROUNDS


function createSectionBlock(title) {
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `${title}`
        }
    };
}

function createFieldsBlock(fields, image) {
    let resp = {
        "type": "section",
        "fields": fields.map(field => ({
            "type": "mrkdwn",
            "text": `*${field.label}:*\n${field.value}`
        })),
    };

    if (image) {
        resp[ "accessory"] = createImageAccessoryBlock(image.url, image.altText)
    }
    return resp
    
}

function createImageAccessoryBlock(imageUrl, altText) {
    return {
        "type": "image",
        "image_url": imageUrl,
        "alt_text": altText
    };
}

function getSlackNotificationModuleDefaults({ moduleType, fields, image, activityTag, originalMessageBlock,text,isSuccessful }) {

    if (moduleType === "notifyScrapedJobApproval") {
        return {
            payload: {
                actionsBlock: createActionsBlock([
                    { text: "Approve", style: "primary", value: `${activityTag}:notifyScrapedJobApproval:approve_scraped_jobs` },
                    { text: "Decline", style: "danger", value: `${activityTag}:notifyScrapedJobApproval:remove_scraped_jobs` }
                ]),
                sectionBlock: createSectionBlock("Techboob Worker Scraped a new job"),
                fieldsBlock: fields && image ? createFieldsBlock(fields, image) : []
            },
            channel: channelSelector(moduleType)
        }
    } else if (moduleType === "notifyScrapedJobApprovalResponseRender") {
        return {
            payload: { 
                actionsBlock: isSuccessful ? null : originalMessageBlock[2],
                sectionBlock: isSuccessful ?  createSectionBlock(text) : originalMessageBlock[0],
                fieldsBlock: originalMessageBlock[1],
                responseTextBlock: isSuccessful ? null : createSectionBlock(text)
            }
        }
    }
}

function channelSelector(moduleType) {
    const ACTION_CHANNEL_MAP ={
        notifyAdmins: "ADMIN_REVIEW",
        testing: "DEV_TESTING",
    }

    if (config.ENV === "development") {
        return ACTION_CHANNEL_MAP.testing
    }
    if (["notifyScrapedJobApproval"].includes(moduleType)) {
        return ACTION_CHANNEL_MAP.notifyAdmins
    }
    return null
}

function createActionsBlock(buttons) {
    return {
        "type": "actions",
        "elements": buttons.map(button => ({
            "type": "button",
            "text": {
                "type": "plain_text",
                "emoji": true,
                "text": button.text
            },
            "style": button.style,
            "value": button.value
        }))
    };
}

function extractEmailTemplatePlaceholders(template,availablePlaceholders = {}) {
    const placeholderRegex = /#{(\w+)}/g;
    const placeholders = [];
    let match;

    while ((match = placeholderRegex.exec(template)) !== null) {
        const placeholderName = match[1];
        const placeholderData = {
            name: availablePlaceholders[placeholderName] || placeholderName.toUpperCase(),
            isRequired: true,
            identifier: placeholderName
        };
        placeholders.push(placeholderData);
    }

    return placeholders;
}


module.exports = {
     async hashPassword(password) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return bcrypt.hash(password, salt);;
    },
    removePathSegments(url) {
        const isAdminRoute = url.startsWith('/api/v1/admin');

        if (isAdminRoute) {
            const regex = /^\/api\/v1\/admin\/([^/]+)\/?/;
            const match = url.match(regex);
            return match ? `/api/v1/admin/${match[1]}` : url;
        } else {
            const regex = /^\/api\/v1\/[^/]+/;
            const match = url.match(regex);

            return match ? match[0] : url;
        }
    },
    getSlackNotificationModuleDefaults,
    channelSelector,
    extractEmailTemplatePlaceholders,
    createFieldsBlock
}