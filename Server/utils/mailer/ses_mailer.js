const config = require('../../config/config')
const { SESClient, SendEmailCommand, SendRawEmailCommand } = require("@aws-sdk/client-ses");
const REGION = config.AWS_SERVICES.SES.region;
const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: config.AWS_SERVICES.SES.accessKeyId,
        secretAccessKey: config.AWS_SERVICES.SES.secretAccessKey
    }
});


module.exports = {
    async mailer(options) {
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
                        Data: options.content,
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
            const response =  await sesClient.send(sendEmailCommand);
            if (response) {
                console.log(`Email sent to ${options.email}`)
            }
            return response
        } catch (e) {
            console.log(e);
            throw e
        }
    },

    async sendRawEmail(options) {
        try {
            const input = {
                Destinations: options.destinations || [],
                RawMessage: {
                    Data: options.rawEmail
                },
            };
            const sendRawEmailCommand = new SendRawEmailCommand(input)
            const response =  await sesClient.send(sendRawEmailCommand);
            if (response) {
                console.log(`Email sent to ${options.email}`)
            }
            return response
        } catch (e) {
            console.log(e);
            throw e
        }
    }
}