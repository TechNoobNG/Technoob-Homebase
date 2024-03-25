
const config = require('../../config/config')
const platform = config.WORKER_QUEUE_PLATFORM;
const { sendMessage } = require("../queues/queueService");

module.exports = {
    async addToMailingListCSVWithSlackUpdate(data) {
        try {
            if (!data.method) data.method = "actWithSlackUpdate";
            data.import = "../../services/integrations/slack";
            await sendMessage(data);
            return {
                message: 'Action successfully added to job queue'
            };
        } catch (error) {
            throw error;
        }
    },

    async addToMailingListCSV(data) {
        try {
            if (!data.method) data.method = "addToMailingListCSV";
            data.import = "../../services/admin";
            await sendMessage(data);
            return { message: 'Action successfully added to job queue' };
        } catch (error) {
            throw error;
        }
    },

    async generateMailingListCSVDownloadUrlWithSlackUpdate(data) {
        try {
            if (!data.method) data.method = "actWithSlackUpdate";
            data.import = "../../services/integrations/slack";
            await sendMessage(data);
            return { message: 'Action successfully added to job queue' };
        } catch (error) {
            throw error;
        }
    }
}
