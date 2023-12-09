const queue = require("../../azureQueue/init");
class MailService {
    async sendEmail(data) {
        if (!data.method) data.method = "sendEmail";
        data.import = "../utils/mailer/mailBuilder";
        await queue.sendMessage(data);
    }
}

module.exports =  MailService;