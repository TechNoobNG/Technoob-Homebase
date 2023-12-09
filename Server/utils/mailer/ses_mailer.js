const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const SESClient = require("@aws-sdk/client-ses").SESClient;
const SendEmailCommand = require("@aws-sdk/client-ses").SendEmailCommand;
const REGION = "eu-north-1";
const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
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
    }
}