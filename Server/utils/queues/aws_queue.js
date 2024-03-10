
const config = require('../../config/config')
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
    sendMessage: async (data) => {
        try {
            let message = data;
            const command = new SendMessageCommand({
                MessageBody: JSON.stringify(message),
                QueueUrl: queueUrl
            }) 
            const response = await queueClient.send(command)
            console.log(response)
            return response
        } catch (error) {
            throw error
        }
    }
};