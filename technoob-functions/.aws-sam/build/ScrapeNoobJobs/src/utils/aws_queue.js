// Retrieve the connection from an environment
// variable called AZURE_STORAGE_CONNECTION_STRING
import  config from './config.js';
import { SQSClient, SendMessageCommand,  } from "@aws-sdk/client-sqs"; 
const REGION = config.AWS_SERVICES.SQS.region;
const queueClient = new SQSClient({
    region: REGION,
    credentials: {
        accessKeyId: config.AWS_SERVICES.SES.accessKeyId,
        secretAccessKey: config.AWS_SERVICES.SES.secretAccessKey
    }
})
const queueUrl = config.AWS_SERVICES.SQS.queueUrl;

export async function sendMessage(data) {
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