import axios from "axios";

const SLACK_WEBHOOK_URL = process.env.DEV_TESTING_WEBHOOK


export function emlToSlackBlock({parseEmlContent,bucket,objectName}) {
    console.log(parseEmlContent);
    const from = parseEmlContent.from.text;
    const subject = parseEmlContent.subject;
    const date = parseEmlContent.date;
    const emailContent = parseEmlContent.text;
    const to = parseEmlContent.to.text;
    const url = `${process.env.LIVE_BASE_URL || "https://staging-api.technoob.tech"}/api/v1/download/${objectName}/${bucket}`
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
                        "action_id": "reply_button"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Mark as Read"
                        },
                        "style": "primary",
                        "action_id": "mark_as_read_button"
                    }
                ]
            }
        ]
    };

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