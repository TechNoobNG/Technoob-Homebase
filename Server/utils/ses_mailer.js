const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const templates = require('../models/email_templates');
const SESClient = require("@aws-sdk/client-ses").SESClient;
const SendEmailCommand = require("@aws-sdk/client-ses").SendEmailCommand;
const queue = require('../azureQueue/init');

// Set the AWS Region.
const REGION = "eu-north-1";
// Create SES service object.

const sesClient = new SESClient({ 
    region: REGION,
    credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    }
});

class SESMailer {

    async sendEmail(data) {
        if (!data.method) data.method = "sendEmail";
        data.import = "../utils/ses_mailer";
        console.log(data)
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
        // 1) retrieve email template from database
        const template = await templates.findById(options.template_id);
        if(!template) throw new Error ("Invalid template ID");

        //Parse HTML and replace constants
        let content = template.template.toString();
        Object.keys(options.constants).forEach((key) => {
            content = content.split(`\#{${key}}`).join(options.constants[key]);
        });

        const mailOptions = {
            Destination: {
                CcAddresses: options.cc,
                ToAddresses: [
                options.email
                ],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: content,
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: options.subject,
                },
            },
            Source: config.SENDER_EMAIL_ADDRESS,
        }

        const sendEmailCommand = new SendEmailCommand(mailOptions)

        try {
            return await sesClient.send(sendEmailCommand);
        } catch (e) {
            console.log(e);
        }
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
        // 1) retrieve email template from database
        const template = await templates.findById(options.template_id);
        if(!template) throw new Error ("Invalid template ID")
        let content = template.template.toString();

        let log = {
            successful: [],
            failed: []
        }

        for (const email of options.emails) {
            for (const key of Object.keys(options.constants)) {
                let value = options.constants[key];
                if (key === "username") value = email.displayName;
                content = content.split(`\#{${key}}`).join(value);
            }

            const mailOptions = {
                Destination: {
                    CcAddresses: options.cc,
                    ToAddresses: [
                        email.address
                    ],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: content,
                        },
                    },
                    Subject: {
                    Charset: "UTF-8",
                    Data: options.subject,
                    },
                },
                Source: config.SENDER_EMAIL_ADDRESS,
            }
            const sendEmailCommand = new SendEmailCommand(mailOptions)

            try {
                await sesClient.send(sendEmailCommand);
                log.successful.push(email.address)
            } catch (e) {
                console.log(e);
                log.failed.push(email.address)
            }
        }

        return {
            success: true,
            Message: `Email successfully sent to ${log.successful.length} users, ${log.failed.length} failed}. `,
            failed: log.failed,
            successful: log.successful
        }
    },

    async sendToManyStatic(options) {
        // 1) retrieve email template from database
        const template = await templates.findById(options.template_id);
        if(!template) throw new Error ("Invalid template ID")
        let content = template.template.toString();
        Object.keys(options.constants).forEach((key) => {
            content = content.split(`\#{${key}}`).join(options.constants[key]);
        });

        const mailOptions = {
            Destination: {
                CcAddresses: options.cc,
                ToAddresses: options.to,
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: content,
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: options.subject,
                },
            },
            Source: config.SENDER_EMAIL_ADDRESS,
        }

        const sendEmailCommand = new SendEmailCommand(mailOptions)

        try {
            return await sesClient.send(sendEmailCommand);
        } catch (e) {
            console.log(e);
        }
    },

    SESMailer
}