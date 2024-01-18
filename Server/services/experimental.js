const workerpool = require('workerpool');
const pool = require("../experimental/index")
const { client } = require('../utils/connectors/redishelper');
const computedDownloads = require('../models/computedDownloads')
module.exports = {
    compressFile: async function (file) {
        try {
            const result = await pool.exec('compress',[file])
            return result
        } catch (error) {
            throw error
        }
    },

    mockJob: async function (fileId, channel) {
        setTimeout(async () => {
            const computedDownload = await computedDownloads.findOne({ generatedId: fileId });
            if(computedDownload) {
                computedDownload.status = 'completed';
                computedDownload.url = '/download/' + fileId;
                await computedDownload.save();
                client.publish(channel, JSON.stringify({
                    status: computedDownload.status,
                    url: computedDownload.url
                }));
                console.log('published')
            }
        }, 12000);
    }
}