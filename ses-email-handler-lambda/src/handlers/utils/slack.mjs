import axios from "axios";

const SLACK_WEBHOOK_URL = process.env.DEV_TESTING_WEBHOOK


export function emlToSlackBlock({parseEmlContent,bucket,objectName,attachements}) {
    const from = parseEmlContent.from.text;
    const subject = parseEmlContent.subject;
    const date = parseEmlContent.date;
    const emailContent = parseEmlContent.text;
    const to = parseEmlContent.to.text;
    const url = `${process.env.LIVE_BASE_URL || "https://staging-api.technoob.tech"}/api/v1/download/${objectName}/${bucket}`
    const activityTag = `${bucket}/${objectName}`;
    console.log(attachements)
    const attachmentBlocks = attachements.map((attachment, index) => ({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Attachment ${index + 1}:* [${attachment.name}](${attachment.url})\nSize: ${attachment.size/(1026 * 1026)} MB`
        }
      })) || [];
    const slackBlock = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*New Email Received*"
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*From:*\n${from}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Subject:*\n${subject}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Date:*\n${date}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*To:*\n${to}`
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": emailContent
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": `<${url}|View Full Email>`
                    }
                ]
            },
            ...attachmentBlocks,
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Reply"
                        },
                        "style": "primary",
                        "action_id": "replyEmail",
                        "value": `${activityTag}:handleSesEmail:replyEmail` 
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Mark as Read"
                        },
                        "style": "primary",
                        "action_id": "markEmailAsRead",
                        "value": `${activityTag}:handleSesEmail:markEmailAsRead` 
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Delete"
                        },
                        "style": "danger",
                        "action_id": "deleteEmail",
                        "value": `${activityTag}:handleSesEmail:deleteEmail` 
                    }
                ]
            }
        ]
    };

    console.log(attachmentBlocks)
    console.log("--------------------------------------------------------")
    console.log(slackBlock)

    return slackBlock;

}


export async function sendToSlack(blocks) {
    try {
        await axios.post(SLACK_WEBHOOK_URL, blocks);
    } catch (error) {
      console.error('Error sending to Slack:', error.message);
      throw error;
    }
  }