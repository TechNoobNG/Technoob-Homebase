
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

function createFieldsBlock(fields,image) {
    return {
        "type": "section",
        "fields": fields.map(field => ({
            "type": "mrkdwn",
            "text": `*${field.label}:*\n${field.value}`
        })),
        "accessory": createImageAccessoryBlock(image.url, image.altText)
    };
}

function createImageAccessoryBlock(imageUrl, altText) {
    return {
        "type": "image",
        "image_url": imageUrl,
        "alt_text": altText
    };
}

function getSlackNotificationModuleDefaults({moduleType,fields,image, activityTag}) {
    const slackModules = {
        notifyScrapedJobApproval: {
            actionsBlock : createActionsBlock ([
                { text: "Approve", style: "primary", value: `${activityTag}:notifyScrapedJobApproval:approve_scraped_jobs` },
                { text: "Decline", style: "danger", value: `${activityTag}:notifyScrapedJobApproval:remove_scraped_jobs` }
            ]),
            sectionBlock: createSectionBlock("Techboob Worker Scraped a new job"),
            fieldsBlock: createFieldsBlock(fields, image)
        }
    }

    return {
        payload: slackModules[moduleType] || {},
        channel: channelSelector(moduleType)
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
    channelSelector
}