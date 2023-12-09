const SESMailer = require("./ses_mailer").SESMailer;

const mailer = new SESMailer();

class MailService {

    async sendEmail(data) {
        await mailer.sendEmail(data);
    }
}

module.exports =  MailService;