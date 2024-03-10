const { sendMessage } = require("../queues/queueService");
class MailService {
    async sendEmail(data) {
        if (!data.method) data.method = "sendEmail";
        data.import = "../../utils/mailer/mailBuilder";
        await sendMessage(data);
    }
    async sendRawEmail(data) {
        if (!data.method) data.method = "sendRawEmail";
        data.import = "../../utils/mailer/mailBuilder";
        await sendMessage(data);
    }
    async sendEmailWithSlackUpdate(data) {
        if (!data.method) data.method = "sendEmailWithSlackUpdate";
        data.import = "../../services/integrations/slack";
        await sendMessage(data);
    }
    async sendRawEmailWithSlackUpdate(data) {
        if (!data.method) data.method = "sendRawEmailWithSlackUpdate";
        data.import = "../../services/integrations/slack";
        await sendMessage(data);
    }
}

module.exports =  MailService;