
const config = require('../../config/config')
const platform = config.WORKER_QUEUE_PLATFORM;
const { sendMessage } = require(`./${platform}_queue`);

module.exports = {
    async sendMessage(data) {
        try {

            if (!data) throw Error('No data found');
            if (typeof data !== 'string') data = JSON.stringify(data);

            const options = {
                visibilityTimeout: data.visibilityTimeout || 30
            };

            if (data.delay) {
                const delay = data.delay;
                setTimeout(async () => await sendMessage(data, options), delay )
            } else {
                await sendMessage(data, options);
            }

            return { message: 'Action successfully added to job queue' };
        } catch (error) {
            throw error;
        }
    }
}
