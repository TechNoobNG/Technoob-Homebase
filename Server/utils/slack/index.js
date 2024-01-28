
const axios = require("axios").default;
const config = require('../../config/config');
const slack = axios.create({
    baseURL: config.SLACK.BASE_URL,
    timeout: 5000,
    headers: {"Content-type": "application/json"}
});
  
// const slackClient =  axios.create({
//     baseURL: config.SLACK.BASE_URL,
//     timeout: 5000,
//     headers: {"Content-type": "application/json"}
// });


module.exports = {
    sendRequest: async ({ body, webhook }) => {
        try {
            if (!body) {
                throw new Error("Please provide a body for slack")
            }
            let requestConfig = {};
            let url;
            if (webhook && webhook.channel && config.SLACK.CHANNELS[webhook.channel].WEBHOOK) {
                requestConfig.baseURL = config.SLACK.CHANNELS[webhook.channel].WEBHOOK
            } else {
                url = `${config.SLACK.WORKSPACE_ID}/${webhook.channelId ? webhook.channelId : config.SLACK.CHANNELS[webhook.channel].CHANNEL_ID}/${webhook.channelToken ? webhook.channelToken : config.SLACK.CHANNELS[webhook.channel].WEBHOOK_TOKEN}`
            }
            const resp = await slack.post(url, body,requestConfig);
            return resp.data
        } catch (error) {
            console.error(error)
            throw error
        }
    },

    respondToAction: async ({responseUrl,text,replace_original }) => {
        try {
            let data = { text }
            if (replace_original) {
                data.replace_original = true
            }
            const resp = await axios.post(responseUrl, data, {
                headers: {
                    "Content-type": "application/json"
                }
                
            })
            return resp.data
        } catch (error) {
            throw error.message
        }
    }
}
