// Retrieve the connection from an environment
// variable called AZURE_STORAGE_CONNECTION_STRING
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const { QueueClient } = require("@azure/storage-queue");
const AZURE_STORAGE_CONNECTION_STRING = config.AZURE_STORAGE_CONNECTION_STRING;
const queueName = config.AZURE_QUEUE_NAME;
const queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, queueName);

module.exports = {
    async sendMessage(data) {
        try {
            
            if (!data) throw Error('No data found');
            if (typeof data !== 'string') data = JSON.stringify(data);

            const options = {
                visibilityTimeout: data.visibilityTimeout || 30
            };

            if (data.delay) {
                setTimeout(async () => await queueClient.sendMessage(data, options), delay )
            } else {
                await queueClient.sendMessage(data, options);
            }
            
            
            console.log("Added message to the queue: ", data);
            return { message: 'Action successfully added to job queue' };
        } catch (error) {
            throw error;
        }
    },

    async deleteMessage(data) {
        try {
            if (!data) throw Error('No data found');
            if (typeof data !== 'string') data = JSON.stringify(data);
            await queueClient.deleteMessage(data.messageId, data.popReceipt);
            return { message: 'Action successfully deleted from queue' };
        } catch (error) {
            throw error;
        }
    },

    async receiveMessages() {
        try {
            const response = await queueClient.receiveMessages();
            return response.receivedMessageItems[0];
        }
        catch (error) {
            throw error;
        }

    }
}
