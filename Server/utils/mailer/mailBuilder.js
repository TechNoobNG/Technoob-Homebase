const config = require('../../config/config')
const templates = require('../../models/email_templates');
let mailProvider = config.MAIL_PROVIDER.provider;
let useMultipleProviders = config.MAIL_PROVIDER.useMultiple || false;
const { buildRawEmail, tempReplyTemplate, fetchExternalLinkAndUploadToS3, buildQueryString } = require("../utils");

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
        if (!template) throw new Error("Invalid template ID");
        
        const {queryString} = buildQueryString(options.constants);
        const emailPreviewLink = `https://${config.LIVE_BASE_URL}/api/v1/admin/email/preview/${template.name}?${queryString}`
        options.constants['online_preview_link'] = emailPreviewLink;

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

        const {queryString} = buildQueryString(options.constants);
        const emailPreviewLink = `https://${config.LIVE_BASE_URL}/api/v1/admin/email/preview/${template.name}?${queryString}`
        options.constants['online_preview_link'] = emailPreviewLink;

    
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
                log.failed.push({
                    address: email.address,
                    message: e.message
                });
            }
        });
    
        await Promise.allSettled(promises);
    
        return {
            success: true,
            message: `Email successfully sent to ${log.successful.length} users, ${log.failed.length} failed.`,
            failed: log.failed,
            successful: log.successful
        };
    },

    async sendRawEmail(options) {
        try {

            const {
                from,
                references,
                subject,
                recievedEmailMessageId,
                name,
                username,
                CC,
                BCC,
                Response,
                Attachment
            } = options;

            const templateReplacements = {
                sender: from.match(/"([^"]+)"/)?.[1] || "null",
                content: Response,
                user: name || username
            }

            let reply = tempReplyTemplate;
            for (const [key, value] of Object.entries(templateReplacements)) {
                reply = reply.split(`\#{${key}}`).join(value);    
            }

            const largeAttachments = [];
            const filteredAttachments = [];
            for (const attachment of Attachment) {
                if (attachment.size > 1 * 1024 * 1024) {
                    const attachmentUpload = await fetchExternalLinkAndUploadToS3({
                        url: attachment.url,
                        source: attachment.source,
                        contentType: attachment.contentType,
                        name: attachment.filename,
                        isFile: true,
                        isRestricted: false,
                        canAccessedByPublic: true
                    })
                    largeAttachments.push({
                        url: attachmentUpload.url,
                        name: attachmentUpload.name,
                    })
                } else {
                    filteredAttachments.push(attachment);
                }
            }

            if (largeAttachments.length > 0) {
                const attachmentsHTML = largeAttachments.map(attachment => {
                    return `<li><a href="${attachment.url}">${attachment.name}</a></li>`;
                }).join('');
                
                let replacement = `
                <div>
                <p>This email contains large attachments that could not be directly attached. You can download them using the following links:</p>
                <ul>
                    ${attachmentsHTML}
                </ul>
                </div>`;
                reply = reply.split(`\#{largeAttachmentsHTML}`).join(replacement);    
            } else {
                reply = reply.split(`\#{largeAttachmentsHTML}`).join("");    
            }
           

            const rawEmail = await buildRawEmail({
                from: `${name||username}@technoob.tech`,
                to: from,
                subject: subject,
                inReplyTo: recievedEmailMessageId,
                references,
                message: reply,
                cc: CC,
                bcc: BCC,
                attachments: filteredAttachments
            })
            
            const mailOptions = {
                rawEmail: rawEmail
            }

            const provider = getMailProvider("ses")
            const sendEmail = await provider.sendRawEmail(mailOptions)
            return sendEmail
        } catch (e) {
            console.log(e);
            throw e
        }
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