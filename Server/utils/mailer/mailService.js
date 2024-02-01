const { sendMessage } = require("../queues/queueService");
class MailService {
    async sendEmail(data) {
        if (!data.method) data.method = "sendEmail";
        data.import = "../utils/mailer/mailBuilder";
        await sendMessage(data);
    }
    async sendEmailWithSlackUpdate(data) {
        if (!data.method) data.method = "sendEmailWithSlackUpdate";
        data.import = "../services/integrations/slack";
        await sendMessage(data);
    }
}

module.exports =  MailService;