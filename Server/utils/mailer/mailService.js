const { sendMessage } = require("../queues/queueService");
class MailService {
    async sendEmail(data) {
        if (!data.method) data.method = "sendEmail";
        data.import = "../utils/mailer/mailBuilder";
        await sendMessage(data);
    }
}

module.exports =  MailService;