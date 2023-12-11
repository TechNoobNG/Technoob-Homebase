const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const templates = require('../../models/email_templates');
let mailProvider = config.MAIL_PROVIDER.provider;
let useMultipleProviders = config.MAIL_PROVIDER.useMultiple || false;
function getRandomMailProvider() {
    const providers = ["ses", "azure"];
    const randomIndex = Math.floor(Math.random() * providers.length);
    return providers[randomIndex];
}

function getMailProvider(provider) {
    if (!provider || !["ses", "azure"].includes(provider) || useMultipleProviders) {
        const randomProvider = getRandomMailProvider();
        console.log("Using random provider: " + randomProvider);
        return require(`./${randomProvider}_mailer`);
    } else {
        console.log("Using provider: " + provider);
        return require(`./${provider}_mailer`);
    }
}


module.exports = {
    /**
     * @param {object} options
     * @property {string} options.template_id
     * @property {object} options.constants
     * @property {string} options.email
     * @property {string} options.username
     * @property {string} options.subject
     * @return {number}
     */
    async sendEmail(options) {
        // 1) retrieve email template from database
        const template = await templates.findOne( {id: options.template_id});
        if(!template) throw new Error ("Invalid template ID");

        //Parse HTML and replace constants
        let content = template.template.toString();
        Object.keys(options.constants).forEach((key) => {
            content = content.split(`\#{${key}}`).join(options.constants[key]);
        });
        options.content = content;

        try {
            const provider = getMailProvider(mailProvider)
            const sendEmail = await provider.mailer(options)
            return sendEmail
        } catch (e) {
            console.log(e);
            throw e
        }
    },

    /**
     * @param {object} options
     * @property {string} options.template_id
     * @property {object} options.constants
     * @property {object[]} options.emails
     * @property {string} options.username
     * @property {string} options.subject
     * @return {number}
     */
    async sendToMany(options) {
        // 1) retrieve email template from database
        const template = await templates.findById(options.template_id);
        if(!template) throw new Error ("Invalid template ID")
        let content = template.template.toString();

        let log = {
            successful: [],
            failed: []
        }

        for (const email of options.emails) {
            for (const key of Object.keys(options.constants)) {
                let value = options.constants[key];
                if (key === "username") value = email.displayName;
                content = content.split(`\#{${key}}`).join(value);
            }

            options.content = content;

            try {
                const provider = getMailProvider(mailProvider)
                await provider.mailer(options)
                log.successful.push(email.address)
            } catch (e) {
                console.log(e);
                log.failed.push(email.address)
            }
        }

        return {
            success: true,
            Message: `Email successfully sent to ${log.successful.length} users, ${log.failed.length} failed}. `,
            failed: log.failed,
            successful: log.successful
        }
    },

    async sendToManyStatic(options) {
        // 1) retrieve email template from database
        const template = await templates.findById(options.template_id);
        if(!template) throw new Error ("Invalid template ID")
        let content = template.template.toString();
        Object.keys(options.constants).forEach((key) => {
            content = content.split(`\#{${key}}`).join(options.constants[key]);
        });

        options.content = content;

        try {
            const provider = getMailProvider(mailProvider)
            const sendEmail = await provider.mailer(options)
            return sendEmail
        } catch (e) {
            console.log(e);
        }
    },
}