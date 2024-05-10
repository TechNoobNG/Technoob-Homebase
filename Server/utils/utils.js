
const config = require(`${__dirname}/../config/config.js`)
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = config.SALT_ROUNDS
const EmlParser = require('eml-parser');
const { v4: uuidv4 } = require('uuid');
const axios = require("axios").default;

function createSectionBlock(title) {
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `${title}`
        }
    };
}

function convertTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    let period = 'am';
    let hour = hours;
    if (hour >= 12) {
        period = 'pm';
        hour = (hour === 12) ? hour : hour - 12;
    }
    if (hour === 0) {
        hour = 12;
    }
    return `${hour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatDate(dateString) {   
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = months[parseInt(dateParts[1]) - 1];
    const day = parseInt(dateParts[2]);

    let daySuffix;
    if (day === 1 || day === 21 || day === 31) {
        daySuffix = 'st';
    } else if (day === 2 || day === 22) {
        daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
        daySuffix = 'rd';
    } else {
        daySuffix = 'th';
    }   
    return `${day}${daySuffix} ${month}, ${year}`;
}

function buildQueryString(params) {
    const queryString = Object.keys(params)
        .map(key => params[key] !== undefined && params[key] !== null ? `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}` : "")
        .join('&');
    const fieldsMap = Object.keys(params).map((key) => {
        if(!params[key]) return
        return {
            label: key,
            value: params[key]
        }
    }).filter(Boolean)
    return {
        queryString,
        fieldsMap
    };
}

function createFieldsBlock(fields, image, emailPreviewLink) {
    
    let resp = {
        "type": "section",
        "fields": fields.map(field => {
            const fieldValue = decodeURIComponent(field.value);
            const clippedValue = fieldValue.length > 200 ? `${fieldValue.substring(0, 200)} [Clipped for brevity]` : fieldValue;
            let fieldValueText = hasHtmlTags(fieldValue) ? `_(This field has special characters, kindly click preview to view)_` : clippedValue;
            
            if (field.label.toLowerCase() === "online_preview_link") {
                fieldValueText =  `<${emailPreviewLink}|link>`;
            }
            return {
                "type": "mrkdwn",
                "text": `*${field.label}:*\n${fieldValueText}`
            };
        }),
    };
    if (image) {
        resp[ "accessory"] = createImageAccessoryBlock(image.url, image.altText)
    }
    return resp
    
}

function createImageAccessoryBlock(imageUrl, altText) {
    return {
        "type": "image",
        "image_url": imageUrl,
        "alt_text": altText
    };
}

function getSlackNotificationModuleDefaults({ moduleType, fields, image, activityTag, originalMessageBlock,text,isSuccessful }) {

    if (moduleType === "notifyScrapedJobApproval") {
        return {
            payload: {
                actionsBlock: createActionsBlock([
                    { text: "Approve", style: "primary", value: `${activityTag}:notifyScrapedJobApproval:approve_scraped_jobs` },
                    { text: "Decline", style: "danger", value: `${activityTag}:notifyScrapedJobApproval:remove_scraped_jobs` }
                ]),
                sectionBlock: createSectionBlock("Techboob Worker Scraped a new job"),
                fieldsBlock: fields && image ? createFieldsBlock(fields, image) : []
            },
            channel: channelSelector(moduleType)
        }
    } else if (moduleType === "notifyScrapedJobApprovalResponseRender") {
        return {
            payload: { 
                actionsBlock: isSuccessful ? null : originalMessageBlock[2],
                sectionBlock: isSuccessful ?  createSectionBlock(text) : originalMessageBlock[0],
                fieldsBlock: originalMessageBlock[1],
                responseTextBlock: isSuccessful ? null : createSectionBlock(text)
            }
        }
    }
}

function channelSelector(moduleType) {
    const ACTION_CHANNEL_MAP ={
        notifyAdmins: "ADMIN_REVIEW",
        testing: "DEV_TESTING",
    }

    if (config.ENV === "development") {
        return ACTION_CHANNEL_MAP.testing
    }
    if (["notifyScrapedJobApproval"].includes(moduleType)) {
        return ACTION_CHANNEL_MAP.notifyAdmins
    }
    if(["handleSesEmail"].includes(moduleType)) {
        return ACTION_CHANNEL_MAP.testing
    }
    return null
}

function createActionsBlock(buttons) {
    return {
        "type": "actions",
        "elements": buttons.map(button => ({
            "type": "button",
            "text": {
                "type": "plain_text",
                "emoji": true,
                "text": button.text
            },
            "style": button.style,
            "value": button.value
        }))
    };
}

function extractEmailTemplatePlaceholders(template,availablePlaceholders = {}) {
    const placeholderRegex = /#{(\w+)}/g;
    const placeholders = [];
    let match;

    while ((match = placeholderRegex.exec(template)) !== null) {
        const placeholderName = match[1];
        const placeholderData = {
            name: availablePlaceholders[placeholderName] || placeholderName.toUpperCase(),
            isImage: placeholderName.toLowerCase().includes("image") ? true : false,
            isRequired: placeholderName.toLowerCase().includes("optional") ? false : true,
            isContent: placeholderName.toLowerCase().includes("content") ? true : false,
            isUrl: placeholderName.toLowerCase().includes("url") || placeholderName.toLowerCase().includes("website") || placeholderName.toLowerCase().includes("link") ? true : false,
            isTime: placeholderName.toLowerCase().includes("time") ? true : false,
            isDate: placeholderName.toLowerCase().includes("date") ? true : false,
            identifier: placeholderName
        };
        placeholders.push(placeholderData);
    }

    let uniquePlaceholder = filterUniqueObjects(placeholders);
    return  uniquePlaceholder;
}

function filterUniqueObjects(array) {
    const uniqueArray = [];
    const seenIdentifiers = new Set();
    for (const obj of array) {
        const identifier = JSON.stringify(obj);

        if (!seenIdentifiers.has(identifier)) {
            uniqueArray.push(obj); 
            seenIdentifiers.add(identifier); 
        }
    }

    return uniqueArray;
}

async function emailStreamToObject(stream) {
    const parserInit = new EmlParser(stream)
    const result = await parserInit.parseEml();
    return result
}

function isAttachmentSupported (filename) {
    const unsupportedTypes = [
      'ade', 'adp', 'app', 'asp', 'bas', 'bat', 'cer', 'chm', 'cmd', 'com',
      'cpl', 'crt', 'csh', 'der', 'exe', 'fxp', 'gadget', 'hlp', 'hta', 'inf',
      'ins', 'isp', 'its', 'js', 'jse', 'ksh', 'lib', 'lnk', 'mad', 'maf', 'mag',
      'mam', 'maq', 'mar', 'mas', 'mat', 'mau', 'mav', 'maw', 'mda', 'mdb', 'mde',
      'mdt', 'mdw', 'mdz', 'msc', 'msh', 'msh1', 'msh2', 'mshxml', 'msh1xml',
      'msh2xml', 'msi', 'msp', 'mst', 'ops', 'pcd', 'pif', 'plg', 'prf', 'prg',
      'reg', 'scf', 'scr', 'sct', 'shb', 'shs', 'sys', 'ps1', 'ps1xml', 'ps2',
      'ps2xml', 'psc1', 'psc2', 'tmp', 'url', 'vb', 'vbe', 'vbs', 'vps', 'vsmacros',
      'vss', 'vst', 'vsw', 'vxd', 'ws', 'wsc', 'wsf', 'wsh', 'xnk'
    ];
  
    const fileExtension = filename.split('.').pop().toLowerCase();
    return !unsupportedTypes.includes(fileExtension);
};
  
async function buildRawEmail({
    from,
    to,
    subject,
    inReplyTo,
    references,
    message,
    cc,
    bcc,
    attachments,
  }) {
    const boundary = uuidv4();

    let rawEmail = `MIME-Version: 1.0\n`;

    if (references) {
      rawEmail += `References: ${references}\n`;
    }

    if (inReplyTo) {
      rawEmail += `In-Reply-To: ${inReplyTo}\n`;
    }

    rawEmail += `From: ${from}\nTo: ${to}\nSubject: ${subject}\n`;

    if (cc) {
      rawEmail += `Cc: ${cc}\n`;
    }

    if (bcc) {
      rawEmail += `Bcc: ${bcc}\n`;
    }

    rawEmail += `Content-Type: multipart/related; boundary="${boundary}"\n\n`;

    rawEmail += `--${boundary}\nContent-Type: multipart/alternative; boundary="${boundary}_alt"\n\n`;

    rawEmail += `--${boundary}_alt\nContent-Transfer-Encoding: quoted-printable\nContent-Type: text/html; charset=UTF-8\n\n${message}\n`;

    rawEmail += `--${boundary}_alt--\n`;

    let totalSize = rawEmail.length;

    if (attachments) {
        for (const attachment of attachments) {
          try {
            let attachmentContent;
            let attachmentHeader;
            
            attachmentContent = await fetchAndEncodeBase64(attachment.url, attachment.source);
            attachmentHeader = `--${boundary}\nContent-Type: ${attachment.contentType}; name="${attachment.filename}"\nContent-Transfer-Encoding: base64\nContent-Disposition: attachment; filename="${attachment.filename}"\n\n`;
            rawEmail += attachmentHeader + attachmentContent + '\n';
              
          } catch (error) {
            console.warn(`Skipping attachment ${attachment.filename} due to error:`, error.message);
          }
        }
      }
      

    rawEmail += `--${boundary}--\n`;

    return rawEmail;
}


async function fetchAndEncodeBase64(url,source) {
    try {
        const options = {
            responseType: 'arraybuffer'
        }
        if (source === "slack") {
            options.headers = {
                "Authorization": `Bearer ${config.SLACK.BOT_USER_OAUTH_TOKEN}`
            }
        }
        const response = await axios.get(url, options);
        const base64Content = Buffer.from(response.data).toString('base64');
  
        return base64Content;
    } catch (error) {
      console.error(`Error fetching or encoding content from ${url}:`, error.message);
    }
  }

async function fetchExternalLinkAndUploadToS3({url,source,contentType,name,isFile,isRestricted, acl = "private" , canAccessedByPublic}) {
    try {
        const options = {
            responseType: 'stream'
        }
        if (source === "slack") {
            options.headers = {
                "Authorization": `Bearer ${config.SLACK.BOT_USER_OAUTH_TOKEN}`
            }
        }
        const response = await axios.get(url, options);
        const { upload } = require("./storage/storageService")

        const uploadedLink = await upload({
            type: contentType.split("/")[1],
            name,
            data: response.data,
            isFile,
            acl,
            isRestricted: isRestricted || false,
            canAccessedByPublic: canAccessedByPublic || true,
        })
        return uploadedLink;
    } catch (error) {
        console.log(error)
        console.error(`Error fetching or encoding content from ${url}:`, error.message);
    }
}
  
const tempReplyTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Response</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333333;
        }

        p {
            color: #555555;
        }

        .signature {
            margin-top: 20px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Hello #{sender},</p>

        <p>
            #{content}
        </p>

        <p>
            #{largeAttachmentsHTML}
        </p>

        <p>
            Best regards,<br>
            #{user}
        </p>
        
    </div>
</body>
</html>`

async function flushLogsToDatabase(logBuffer, model) {
    if (logBuffer.length === 0) return;
    try {
    await model.insertMany(logBuffer);
    logBuffer.length = 0;
    } catch (error) {
    console.error('Error flushing logs to the database:', error);
    }
}

function convertRichTextToHtml(elements) {
    let html = '';
    elements.forEach(element => {
        switch (element.type) {
            case 'rich_text_section':
                html += '<p>';
                if (element.elements) {
                    html += convertRichTextToHtml(element.elements);
                }
                html += '</p>';
                break;
            case 'text':
                if (element.text) {
                    let formattedText = element.text;
                    if (formattedText.indexOf('\n') !== -1) {
                        let lines = formattedText.split('\n');
                        formattedText = '';
                        lines.forEach(function(line) {
                            formattedText += '<p>' + line + '</p>';
                        });
                    }
                    if (element.style) {
                        if (element.style.bold) {
                            formattedText = `<b>${formattedText}</b>`;
                        }
                        if (element.style.italic) {
                            formattedText = `<i>${formattedText}</i>`;
                        }
                        if (element.style.strike) {
                            formattedText = `<strike>${formattedText}</strike>`;
                        }
                    }
                    html += formattedText;
                }
                break;
            case 'link':
                if (element.url && element.text) {
                    html += `<a href="${element.url}">${element.text}</a>`;
                }
                break;
            case 'rich_text_preformatted':
                if (element.elements) {
                    html += `<pre>${convertRichTextToHtml(element.elements)}</pre>`;
                }
                break;
            case 'rich_text_quote':
                if (element.elements) {
                    html += `<blockquote>${convertRichTextToHtml(element.elements)}</blockquote>`;
                }
                break;
            case 'rich_text_list':
                if (element.style === 'ordered' && element.elements) {
                    html += "<ol>";
                    element.elements.forEach(section => {
                        if (section.type === "rich_text_section" && section.elements) {
                            section.elements.forEach(element => {
                                if (element.type === "text" && element.text) {
                                    html += `<li>${element.text}</li>`;
                                }
                            });
                        }
                    });
                    html += "</ol>";
                } else {
                    const listType = element.style === 'bullet' ? 'ul' : 'ol';
                    html += `<${listType}>${convertRichTextToHtml(element.elements)}</${listType}>`;
                }
            default:
                break;
        }
    });

    return html;
}

function hasHtmlTags(inputString) {
    const htmlTagPattern = /<[^>]*>/;
    return htmlTagPattern.test(inputString);
}

function createHash({string}) {
    return crypto.createHash('sha256')
            .update(string, config.JWT_SECRET)
            .digest('hex');
}

function validateExpiry(expiry) {
    const expiryTime = parseInt(expiry)
    if (isNaN(expiryTime)) {
        return false;
    }
    const currentTime = Date.now();
    return currentTime <= expiryTime;
}


module.exports = {
     async hashPassword(password) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return bcrypt.hash(password, salt);
    },
    removePathSegments(url) {
        const isAdminRoute = url.startsWith('/api/v1/admin');

        if (isAdminRoute) {
            const regex = /^\/api\/v1\/admin\/([^/]+)\/?/;
            const match = url.match(regex);
            return match ? `/api/v1/admin/${match[1]}` : url;
        } else {
            const regex = /^\/api\/v1\/[^/]+/;
            const match = url.match(regex);
            return match ? match[0] : url;
        }
    },
    getSlackNotificationModuleDefaults,
    channelSelector,
    extractEmailTemplatePlaceholders,
    createFieldsBlock,
    emailStreamToObject,
    isAttachmentSupported,
    buildRawEmail,
    tempReplyTemplate,
    fetchExternalLinkAndUploadToS3,
    flushLogsToDatabase,
    convertRichTextToHtml,
    hasHtmlTags,
    validateExpiry,
    createHash,
    convertTime,
    formatDate,
    buildQueryString
}