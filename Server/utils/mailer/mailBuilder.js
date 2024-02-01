const config = require('../../config/config')
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
        return require(`./${randomProvider}_mailer`);
    } else {
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
        let template;
        if (options.template_id) {
            template = await templates.findById(options.template_id);
        } else if (options.selectedTemplate) {
            template = await templates.findOne({
                name: options.selectedTemplate
            });
        }
        if (!template) throw new Error("Invalid template ID");
    
        let log = {
            successful: [],
            failed: []
        };
    
        const promises = options.emails.map(async (email) => {
            let content = template.template.toString();
    
            for (const [key, value] of Object.entries(options.constants)) {
                if (key === "username") {
                    content = content.split(`\#{${key}}`).join(email.displayName);
                } else {
                    content = content.split(`\#{${key}}`).join(value);
                }
            }
    
            options.email = email.address;
            options.displayName = email.displayName;
            options.content = content;
    
            try {
                const provider = getMailProvider(mailProvider);
                provider.mailer(options);
                log.successful.push(email.address);
            } catch (e) {
                console.log(e);
                log.failed.push({
                    address: email.address,
                    message: e.message
                });
            }
        });
    
        await Promise.all(promises);
    
        return {
            success: true,
            message: `Email successfully sent to ${log.successful.length} users, ${log.failed.length} failed.`,
            failed: log.failed,
            successful: log.successful
        };
    }
    


    //Invalid implementation
    // async sendToManyStatic(options) {
    //     // 1) retrieve email template from database
    //     const template = await templates.findById(options.template_id);
    //     if(!template) throw new Error ("Invalid template ID")
    //     let content = template.template.toString();
    //     Object.keys(options.constants).forEach((key) => {
    //         content = content.split(`\#{${key}}`).join(options.constants[key]);
    //     });

    //     options.content = content;

    //     try {
    //         const provider = getMailProvider(mailProvider)
    //         const sendEmail = await provider.mailer(options)
    //         return sendEmail
    //     } catch (e) {
    //         console.log(e);
    //     }
    // },
}