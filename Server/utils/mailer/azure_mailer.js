const config = require('../../config/config')
const { EmailClient } = require("@azure/communication-email");
const connectionString = config.COMMUNICATION_SERVICES_CONNECTION_STRING;
const emailClient = new EmailClient(connectionString);

module.exports = {
    async mailer(options) {
        try {

            mailOptions = {
                senderAddress: config.SENDER_EMAIL_ADDRESS,
                content: {
                    subject: options.subject,
                    html: options.content,
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
            if (response && response.status === "Succeeded" ) {
                console.log(`Email sent to ${options.email}: ${response.id}`)
            } else {
                throw new Error(response.error)
            }
            return response
        } catch (e) {
            throw e
        }
    },

}




