const env = process.env.NODE_ENV || 'production';
const config = require('./config')[env];

const { SQSClient, SendMessageCommand,  } = require("@aws-sdk/client-sqs"); 
const REGION = config.AWS_SERVICES.SQS.region;
const queueClient = new SQSClient({
    region: REGION,
    credentials: {
        accessKeyId: config.AWS_SERVICES.SES.accessKeyId,
        secretAccessKey: config.AWS_SERVICES.SES.secretAccessKey
    }
})
const queueUrl = config.AWS_SERVICES.SQS.queueUrl;


module.exports = {
    async sendMessage(data) {
        try {
            let message = data;
            const command = new SendMessageCommand({
                MessageBody: JSON.stringify(message),
                QueueUrl: queueUrl
            })
            const response = await queueClient.send(command)
            return response
        } catch (error) {
            throw error
        }
    }
}
