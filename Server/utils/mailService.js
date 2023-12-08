const AzureMailer = require("./azure_mailer").AzureMailer;

const mailer = new AzureMailer();

class MailService {

    async sendEmail(data) {
        await mailer.sendEmail(data);
    }
}

module.exports =  MailService;