const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const { EmailClient } = require("@azure/communication-email");
const templates = require('../models/email_templates');
const queue = require('../azureQueue/init');


const connectionString = config.COMMUNICATION_SERVICES_CONNECTION_STRING;

// const catch429Policy = {
//     name: "catch429Policy",
//     async sendRequest(request, next) {
//         const response = await next(request);
//         if (response.status === 429) {
//             throw new Error(response);
//         }
//         return response;
//     }
// };

// const clientOptions = {
//     additionalPolicies: [
//         {
//             policy: catch429Policy,
//             position: "perRetry"
//         }
//     ]
// }

const emailClient = new EmailClient(connectionString);

class AzureMailer {

    async sendEmail(data) {
        if (!data.method) data.method = "sendEmail";
        data.import = "../utils/azure_mailer";
        await queue.sendMessage(data);

    }
}


module.exports = {
    /**
     * @param {object} options
     * @property {string} options.template_id
     * @property {object} options.constants
     * @property {string} options.email
     * @property {string} options.username
     * @property {string} options.subject
     * @return {number}
     */
    async sendEmail(options) {
        try {
            // 1) retrieve email template from database
            const template = await templates.findById(options.template_id);
            if(!template) throw new Error ("Invalid template ID")
            let content = template.template.toString();
            Object.keys(options.constants).forEach((key) => {
                content = content.split(`\#{${key}}`).join(options.constants[key]);
            });
            const mailOptions = {
                senderAddress: config.SENDER_EMAIL_ADDRESS,
                content: {
                    subject: options.subject,
                    html: content,
                },
                recipients: {
                    to: [
                        {
                            address: options.email,
                            displayName: options.username,
                        },
                    ],
                },
                cc: options.cc,
                bcc: options.bcc,
                attachments: options.attachments?.map((attachment) => ({
                    name: attachment.name,
                    contentType: attachment.contentType,
                    contentUrl: attachment.url,
                    content: { disposition: 'attachment' },
                })),
            };

            const poller = await emailClient.beginSend(mailOptions);
            const response = await poller.pollUntilDone();
            if (response) {
                console.log(`Email sent to ${options.email}: ${response.id}`)
            }
            return response
        } catch (e) {
            console.log(e);
        }
        return null
    },

   /**
     * @param {object} options
     * @property {string} options.template_id
     * @property {object} options.constants
     * @property {object[]} options.emails
     * @property {string} options.username
     * @property {string} options.subject
     * @return {number}
     */
    async sendToMany(options) {
        try {

            // 1) retrieve email template from database
            const template = await templates.findById(options.template_id);
            if(!template) throw new Error ("Invalid template ID")
            let content = template.template.toString();

            let log = {
                successful: [],
                failed: []
            }

            await Promise.all(options.emails.map(async (email) => {
                Object.keys(options.constants).forEach((key) => {
                    console.log(key)
                    let value = options.constants[key]
                    switch (key) {
                        case "username":
                            value = email.displayName;
                            break;
                        case "others":
                            value = options.constants.others;
                            break;
                        // add more cases as needed
                        default:
                            value = options.constants[key]; // default value if key doesn't match any case
                    }
                    content = content.split(`\#{${key}}`).join(value);
                });
                const mailOptions = {
                    senderAddress: config.SENDER_EMAIL_ADDRESS,
                    content: {
                        subject: options.subject,
                        html: content,
                    },
                    recipients: {
                        to: [
                            {
                                address: email.address,
                                displayName: email.username,
                            },
                        ],
                        cc: options.cc,
                        bcc: options.bcc,
                    },

                    attachments: options.attachments?.map((attachment) => ({
                        name: attachment.name,
                        contentType: attachment.contentType,
                        contentUrl: attachment.url,
                        content: { disposition: 'attachment' },
                    })),
                };

                const poller = await emailClient.beginSend(mailOptions);
                const response = await poller.pollUntilDone();
                if (response.status === "Succeeded") {
                    console.log(`Email sent to ${email.displayName}: ${response.id}`)

                    log.successful.push(email.address)
                } else {
                    console.log(`Email failed to send to ${email.displayName}: ${response.id}`)
                    log.failed.push(email.address)

                }

            }))

            return {
                success: true,
                Message: `Email successfully sent to ${log.successful.length} users, ${log.failed.length} failed}. `,
                failed: log.failed,
                successful: log.successful
            }

        } catch (e) {
            console.log(e);
            throw Error
        }

    },

    async sendToManyStatic(options) {
        try {
            // 1) retrieve email template from database
            const template = await templates.findById(options.template_id);
            if(!template) throw new Error ("Invalid template ID")
            let content = template.template.toString();
            Object.keys(options.constants).forEach((key) => {
                content = content.split(`\#{${key}}`).join(options.constants[key]);
            });
            const mailOptions = {
                senderAddress: config.SENDER_EMAIL_ADDRESS,
                content: {
                    subject: options.subject,
                    html: content,
                },
                recipients: {
                    to: options.to,
                    cc: options.cc,
                    bcc: options.emails,
                },

                attachments: options.attachments?.map((attachment) => ({
                    name: attachment.name,
                    contentType: attachment.contentType,
                    contentUrl: attachment.url,
                    content: { disposition: 'attachment' },
                })),
            };

            const poller = await emailClient.beginSend(mailOptions);
            const response = await poller.pollUntilDone();
            if (response.status === "Succeeded") {
                console.log(`Email sent`)

            }
            return {
                success: true,
                Message: `Emails successfully sent `,
                log: response
            }
        } catch (e) {
            console.log(e);
        }

    },

    AzureMailer

}




