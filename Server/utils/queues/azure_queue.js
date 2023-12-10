
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const { QueueClient } = require("@azure/storage-queue");
const AZURE_STORAGE_CONNECTION_STRING = config.AZURE_STORAGE_CONNECTION_STRING;
const queueName = config.AZURE_QUEUE_NAME;
const queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, queueName);


module.exports = {
    sendMessage: async (data) => {
        try {
            let message = data;
            const options = {
                visibilityTimeout: data.visibilityTimeout || 30
            };
            if (typeof data !== 'string') message = JSON.stringify(data);
            const response = await queueClient.sendMessage(message,options);
            return response
        } catch (error) {
            throw error
        }
    }
};