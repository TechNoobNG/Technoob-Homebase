const Templates = require('../models/email_templates');
const uuid = require('uuid');
const Admin = require('../models/admin');
const Permissions = require('../models/permissions');
const User = require('../models/user');
const mailing_list = require('../models/mailing_list');
const mailingListGroup = require("../models/mailing_list_grouping");
const contact_us = require('../models/contact_us');
const frontend_resources = require('../models/frontend_resources');
const contributors = require('../models/contributors');
const resources = require('../services/resources')
const users = require('../services/user');
const traffic = require('../services/traffic');
const ErrorResponse = require('../utils/error/errorResponse');
const MailService = require('../utils/mailer/mailService');
const mailService = new MailService();
const { extractEmailTemplatePlaceholders, buildRawEmail, tempReplyTemplate, createHash } = require("../utils/utils");
const jobScheduler = require("../utils/queues/jobScheduler");
const csvtojson = require('csvtojson');
const { default: axios } = require('axios');
const { Parser } = require('json2csv');
const config = require('../config/config')

module.exports = {
    async adminDashboard() {
        try {
            const resourceMetrics = await resources.getMetrics()
            const userMetrics = await users.getMetrics()
            const now = new Date();
            const trafficMetric = await traffic.getMonthlyTrafficForYear(now.getFullYear())
            return {
                resourceMetrics,
                userMetrics,
                trafficMetric
            }
        } catch (err) {
            throw err
        }

    },

    async traffic(range) {
        try {
            let data;

            if (range) {
                if (range.lastSevenDaily) {
                    data = await traffic.getDailyTrafficForWeek();
                } else if (range.months) {
                    data = await traffic.getTrafficForLastNMonths(range.months);
                } else if (range.year && !range.month) {
                    data = await traffic.getTotalTrafficByYear(range.year);
                } else if (range.halfYear) {
                    data = await traffic.getTrafficForLastNMonths(6);
                } else if (range.quaterYear) {
                    data = await traffic.getMetricsLastThreeMonths();
                } else if (range.days) {
                    data = await traffic.getMetricsLastDays(range.days);
                } else if (range.month && range.year) {
                    data = await traffic.getDailyTrafficForMonth(range.month, range.year);
                } else if (range.week) {
                    data = await traffic.getMetricsLastSevenDays();
                } else if (range.daily) {
                    data = await traffic.getDailyTraffic();
                } else if (range.lastThreeMonths) {
                    data = await traffic.getMetricsLastThreeMonths();
                } else {
                    data = await traffic.getOverallTotalTraffic();
                }
            } else {
                data = await traffic.getOverallTotalTraffic();
            }

            return data;
        } catch (err) {
            throw err;
        }
    },


    async  saveMailTemplate(data) {
        try {
            if (!data || !data.template) {
                throw new Error("Kindly provide a template in html format");
            }
    
            const placeholders = extractEmailTemplatePlaceholders(data.template, data.availablePlaceholders);
            
            const templateData = {
                name: data.name,
                template: data.template,
                id: uuid.v4(),
                placeholders: placeholders
            };
    
            return await Templates.create(templateData);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    
    async inviteAdmin(email,admin_user) {
        try {
            //check if user already exists
            const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });

            if (!user) {
                throw new ErrorResponse(
                    404,
                    "No user found"
                )
            }

            let admin = await Admin.find({
                user_id: user._id
            })

            let sendemail = admin.isActive ? false : true
            if (!admin.length) {
                admin = await Admin.findOneAndUpdate({ user_id: user._id }, { isActive: true, permissions: [], role: "admin" }, { new: true, upsert: true })
                sendemail = true
            } else {
                admin = await Admin.findOneAndUpdate({ user_id: user._id }, { isActive: true, permissions: [] }, { new: true })
            }

            if (sendemail) {
                const constants = {
                    username: user.username,
                    inviter: admin_user.username
                }
                const mailOptions = {
                    email: user.email,
                    subject: 'You have been invited to be an admin',
                    constants,
                    template_id: "5e9a8177-3bc6-43e9-a804-ca6a41095fe0",
                    username: user.username
                }

                await mailService.sendEmail({
                    data: mailOptions
                });

            }
            const response = {
                user: user,
                admin_profile: admin
            }

            return response
        } catch (err) {
            throw err
        }
    },
    async removeAdmin(email) {
        try {

            const user = await User.findOneAndUpdate({ email }, { role: 'user' }, { new: true })
            const isActive = await Admin.checkStatus(user._id)

            if (!isActive) {
                throw new ErrorResponse(
                    400,
                    "User is not an admin"
                )
            }
            const options = { new: true }
            const admin = await Admin.findOneAndUpdate({ user_id: user._id }, { isActive: false }, options)

            if (!user || !admin) {
                throw new Error('User not found/ User is not an admin')
            }


            const response = {
                user: user,
                admin_profile: admin
            }

            const constants = {
                username: user.name
            }
            const mailOptions = {
                email: email,
                subject: "Your admin access has been revoked",
                constants,
                template_id: "8177-3bc6-43e9-a804-ca6a415fe0",
                username: user.username
            }


            await mailService.sendEmail({
                name: "SingleEmail",
                data: mailOptions
            });

            return response
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async create_permission(team, data) {
        try {
            const { name, description } = data;
            const permission = `${team}:${name.split(' ').join('')}`
            const newPermission = new Permissions({ name, permission, team, description });
            await newPermission.save();
            return newPermission
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async getMailTemplates(query) {
        try {
            let page = query.page || 1;
            let limit = query.limit || 5;
            let skip = (page - 1) * limit;
            let count = 0;
            const templates = await Templates.find()
                .skip(skip)
                .limit(limit);
            if (templates) {
                count = templates.length
            }
            return {
                templates,
                page,
                limit,
                count
            };
        }
        catch (err) {
            throw err
        }
    },
    async getMailTemplate(id) {
        try {
            const template = await Templates.findById(id);
            if (!template) {
                throw new ErrorResponse(
                    404,
                    "Template not found"
                );
            }
            return template
        } catch (err) {
            throw err
        }
    },
    async getMailTemplateByName(name) {
        try {
           
            const template = await Templates.findOne({
                name:name
            });
            
            if (!template) {
                throw new Error(
                    "Not found"
                );
            }
            return template
        } catch (err) {
            throw err
        }
    },

    parseEmailContent(getTemplate,renderPlaceHolders) {
        try {
            let content = getTemplate.template.toString();
            Object.keys(renderPlaceHolders).forEach((key) => {
                content = content.split(`\#{${key.toLowerCase()}}`).join(renderPlaceHolders[key]);
            });
            return content
        } catch (error) {
            throw error
        }
    },
    async getAdmins() {
        try {
            const admins = await Admin.find().populate('user_id').populate('permissions');
            return admins
        } catch (err) {
            throw err
        }
    },

    async getAdmin(id) {
        try {
            const admin = await Admin.findById(id).populate('user_id').populate('permissions');
            if (!admin) {
                throw new ErrorResponse(
                    404,
                    "Admin not found"
                )
            }
            return admin

        } catch (err) {
            console.log(err)
            throw err
        }
    },
    async delete_permission(id) {
        try {
            const permission = await Permissions.findByIdAndRemove(id);
            if (!permission) {
                throw new ErrorResponse(
                    404,
                    "Permission not found"
                )
            }
            const response = {
                message: 'Permission deleted successfully',
                permission
            }
            return response
        }
        catch (err) {
            throw err
        }
    },
    async deactivatePermission(id) {
        try {
            const permission = await Permissions.findByIdAndUpdate(id, { isActive: false }, { new: true });
            if (!permission) {
                throw new ErrorResponse(
                    404,
                    "Permission not found"
                )
            }
            return permission
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    async get_permissions() {
        try {
            const permissions = await Permissions.find();
            return permissions
        } catch (err) {
            throw err
        }
    },

    async get_permission(id) {
        try {
            const permission = await Permissions.findById(id);
            if (!permission) {
                throw new ErrorResponse(
                    404,
                    "Permission not found"
                )
            }
            return permission
        } catch (err) {
            throw err
        }
    },

    async add_permission(email, permission) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found')
            }

            const check_user_permission = await Admin.findOne({ user_id: user._id });
            if (!check_user_permission) {
                await Admin.create({ user_id: user._id, role: 'user', permissions: [] })
            }
            const check_permission = await Permissions.findOne({ permission });
            if (!check_permission) {
                throw new ErrorResponse(
                    404,
                    "Permission not found"
                )
            }

            if (check_user_permission?.permissions?.includes(check_permission._id)) {
                throw new ErrorResponse(
                    400,
                    'User already has this permission / permission not found'
                )
            }

            const admin = await Admin.findOne({ user_id: user._id });
            admin.permissions.push(check_permission._id);
            await admin.save();
            return admin

        } catch (err) {
            throw err
        }
    },

    async remove_permission(email, permission) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new ErrorResponse(
                    404,
                    "Permission not found"
                )
            }
            const check_user_permission = await Admin.findOne({ user_id: user._id });
            if (!check_user_permission) {
                throw new ErrorResponse(
                    400,
                    "This User is not an admin"
                )
            }
            const check_permission = await Permissions.findOne({ permission });
            if (!check_permission) {
                throw new ErrorResponse(
                    404,
                    "Permission not found"
                )
            }

            if (!check_user_permission?.permissions?.includes(check_permission._id)) {
                throw new ErrorResponse(
                    400,
                    'User does not have this permission / permission not found'
                )

            }

            const new_perms = check_user_permission.permissions.filter(perm => perm.toString() !== check_permission._id.toString())
            check_user_permission.permissions = new_perms
            await check_user_permission.save();
            return check_user_permission

        } catch (err) {
            throw err
        }
    },

    async sendNotificationEmail(content) {
        try {
            const emailObjects = await Promise.all(content.emails.map(async (email) => {
                const user = await User.findOne({ email: email });
                if (user) {
                    return { address: user.email, displayName: user.username };
                } else {
                    return null;
                }
            })).then(objects => objects.filter(obj => obj !== null)).catch(err => { throw new ErrorResponse(err) });

            const constants = {
                message: content.message,
                username: null,
                subject: content.subject
            }

            const mailOptions = {
                emails: emailObjects,
                subject: content.subject,
                constants: constants,
                template_id: content.template_id
            }


            await mailService.sendEmail({
                name: "BulkStaticEmail",
                method: "sendToMany",
                data: mailOptions
            });

            return {
                message: "Email Queued Successfully"
            }
        } catch (err) {
            throw err
        }
    },

    async sendNotificationEmailStatic(content) {
        try {
            const emailObjects = await Promise.all(content.emails.map(async (email) => {
                const user = await User.findOne({ email: email });
                if (user) {
                    return { address: user.email, displayName: user.username };
                } else {
                    return null;
                }
            })).then(objects => objects.filter(obj => obj !== null)).catch(err => { throw new ErrorResponse(err) });;

            const constants = {
                message: content.message,
                username: "Noobies",
                subject: content.subject
            }

            const mailOptions = {
                to: [{ address: "technoobng@gmail.com", displayName: "Noobies" }],
                emails: emailObjects,
                subject: content.subject,
                constants: constants,
                template_id: content.template_id
            }

            await mailService.sendEmail({
                name: "BulkStaticEmail",
                method: "sendToMany",
                data: mailOptions
            });

            return {
                message: "Email Queued Successfully"
            }
        } catch (err) {
            throw err
        }
    },

    async sendEmailToMailingList(content) {
        try {
            const {
                selectedTemplate,
                placeHolders,
                groupName,
                owner,
                template_id,
                subject,
                source,
                user
            } = content;

            const list = await mailing_list.find({
                groupId: `${owner}:${groupName}`
            })
            let emailObjects = []
            if (list.length && list.length > 1) {
                emailObjects = list.map((user) => {
                    return {
                        address: user.email,
                        displayName: user.username || user.firstname || user.lastname || user.email.split('@')[0] || ""
                    }
                })
            }

            const constants = {};
            for (const key in placeHolders) {
                constants[key.toLowerCase().replace(" ", "_")] = placeHolders[key];
            } 

            const mailOptions = {
                emails: emailObjects,
                subject: subject,
                constants: constants,
                template_id: template_id,
                selectedTemplate: selectedTemplate,
            }

            if (source === "slack") {
                await mailService.actWithSlackUpdate({
                    name: "BulkStaticEmailWithSlackUpdate",
                    method: "actWithSlackUpdate",
                    data: {
                        mailOptions,
                        moduleName: "BulkStaticEmailWithSlackUpdate",
                        user
                    }
                });
            } else {
                await mailService.sendEmail({
                    name: "BulkStaticEmail",
                    method: "sendToMany",
                    data: mailOptions
                });
            }


            return {
                message: "Email Queued Successfully"
            }
            
        } catch (error) {
            
        }
    },

    async createMailingListCSV(data) {
        try {
            const {
                url,
                name,
                owner,
                user,
                source
            } = data;

            const groupId = `${owner}:${name}`

            const setupData = {
                groupId,
                url,
                owner
            };

            if (source === "slack") {
                await jobScheduler.addToMailingListCSVWithSlackUpdate({
                    name: "AddToMailingListCSVWithSlackUpdate",
                    data: {
                        setupData,
                        moduleName: "AddToMailingListCSVWithSlackUpdate",
                        user
                    }
                });
            } else {
                await jobScheduler.addToMailingListCSV({
                    name: "AddToMailingListCSV",
                    method: "addToMailingListCSV",
                    data: setupData
                });
            }


            return {
                message: "Job Queued Successfully"
            }
            
        } catch (error) {
            console.log(error)
        }
    },

    async addToMailingListCSV(data) {
        try {
            const { groupId, url, owner } = data;
            const options = {
                responseType: 'stream'
            };
    
            const response = await axios.get(url, options);
            const csvData = response.data;
            
            const jsonArray = await csvtojson().fromStream(csvData);
            const filteredData = jsonArray.map((e) => {
                const filteredObject = {};
                for (const key in e) {
                    if (e[key] !== 'NULL') {
                        filteredObject[key] = e[key];
                    }
                }
                return filteredObject;
            })

            const resp = await module.exports.addToMailingList({ emails: filteredData, groupId:groupId  });
    
            return {
                emails: resp,
                groupId,
                url
            };
        } catch (error) {
            throw error;
        }
    },

    async respondToEmail({ source, user, adminResponse, emailInfo }) {
        try {            
              
            const { module, bucket, key, from, references, subject, recievedEmailMessageId } = emailInfo;
            const { name, username } = user;
            let { CC, BCC, Response, Attachment } = adminResponse;

            if (source === "slack") {
                Attachment = Attachment.map((each) => {
                    return {
                        filename: each.name,
                        contentType: each.mimetype,
                        url: each.url_private_download,
                        size: each.size,
                        source
                    }
                });
            }

            const mailOptions = {
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
            }

            await mailService.sendRawEmail({
                name: "RawEmailReply",
                method: "sendRawEmail",
                data: mailOptions
            });

            return {
                message: "Email Queued Successfully"
            }


        } catch (error) {
            throw error
        }
    },

    async getMailingList(query) {
        try {
            let page = query.page || 1;
            let limit = query.limit || 5;
            let skip = (page - 1) * limit;
            let count = 0;
            const mailingList = await mailing_list.find()
                .skip(skip)
                .limit(limit);

            if (mailingList) {
                count = mailingList.length
            }
            return {
                mailingList,
                page,
                limit,
                count
            };
        } catch (err) {
            throw err
        }
    },

    addToMailingList: async function (body) {
        try {
            if (!body.emails || !Array.isArray(body.emails)) {
                throw new ErrorResponse("400","Invalid emails")
            }

            const emailsTobeCreated = body.emails.map((email) => {
                return {
                    email: email.mail,
                    username: email.username || email.mail.split("@")[0],
                    firstname: email.firstname,
                    lastname: email.lastname,
                    groupId: email.groupId || body.groupId
                }
            })
            const mailingList = await mailing_list.insertMany(emailsTobeCreated);
            return mailingList
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    generateMailingListCSV: async function ({groupName, owner = "technoob-workspace"}) {
        try {
            if (!groupName) {
                throw new ErrorResponse("400","No group name provided")
            }
            const group = await mailingListGroup.findOne({
                groupName: groupName
            })
            if (!group) {
                throw new ErrorResponse("404",`${groupName} not found`)
            }

            let mailingList = await mailing_list.find({
                groupId: group.id
            })
            mailingList = mailingList.map(record => record.toJSON());
            const parser = new Parser();
            return parser.parse(mailingList);
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    generateMailingListCSVDownloadUrl: async function ({groupName, userId, user, source}) {
        try {

            if (!groupName || !userId) {
                throw new ErrorResponse("400", "No group name or user ID provided");
            }
    
            const group = await mailingListGroup.findOne({
                groupName: groupName
            });
            if (!group) {
                throw new ErrorResponse("404", `${groupName} not found`);
            }
    
            const expiry = Date.now() + (24 * 60 * 60 * 1000);
            const string = `${groupName}:${userId}:${expiry}`
            const hash = createHash({
                string
            })

            const queryString = `?groupName=${encodeURIComponent(groupName)}&hash=${encodeURIComponent(hash)}&userId=${encodeURIComponent(userId)}&expiry=${expiry}`;
            const downloadUrl = `${config.LIVE_BASE_URL}/api/v1/admin/mailing-list/download${queryString}`;

            if (source === "slack") {
                const setupData = {
                    groupName,
                    userId: user.id
                }
                await jobScheduler.generateMailingListCSVDownloadUrlWithSlackUpdate({
                    name: "GenerateMailingListCSVDownloadUrlWithSlackUpdate",
                    data: {
                        setupData,
                        moduleName: "GenerateMailingListCSVDownloadUrlWithSlackUpdate",
                        user
                    }
                });
                return {
                    message: "Job queued successfully"
                }
            } else {
                return downloadUrl;
            }

        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    
    async createMailingListGroup(data) {
        try {
            if (!data.groupName) {
                throw new Error("No group name provided")
            }
            const group = await mailingListGroup.create({
                owner: data.owner || "technoob-workspace",
                groupName: data.groupName,
                id: `${data.owner}:${data.groupName}` || `technoob-workspace:${data.groupName}`
            })

            return {
                name: group.groupName,
                owner: group.owner,
                id: group.id
            }
        } catch (err) {
            throw err
        }
    },

    async getContactUs(query) {
        try {
            const contactUs = await contact_us.find();
            return contactUs
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    async deleteContactUs(id) {
        try {
            const contactUs = await contact_us.findByIdAndRemove(id);
            if (!contactUs) {
                throw new Error('Contact Us not found')
            }
            const response = {
                message: 'Contact Us deleted successfully',
                contactUs
            }
            return response
        }
        catch (err) {
            console.log(err)
            throw err
        }
    },

    async deleteMailingList(id) {
        try {
            const mailingList = await mailing_list.findByIdAndRemove(id);
            if (!mailingList) {
                throw new Error('Mailing List not found')
            }
            const response = {
                message: 'Mailing List deleted successfully',
                mailingList
            }
            return response
        }
        catch (err) {
            console.log(err)
            throw err
        }
    },


    async addMailingList(email) {
        try {
            const check_mailing_list = await mailing_list.findOne({ email });
            if (check_mailing_list) {
                throw new Error('Email already exists')
            }
            const mailingList = await mailing_list.create({ email });
            return mailingList
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    async getContactUsMessage(id) {
        try {
            const contactUs = await contact_us.findById(id);
            if (!contactUs) {
                throw new Error('Contact Us not found')
            }
            return contactUs
        } catch (err) {
            throw err
        }
    },

    async createFrontendResource(data) {
        try {
            return frontend_resources.create(data)
        } catch (err) {
            console.log(err)
            throw err
        }

    },

    async getFrontendResources() {
        try {
            return frontend_resources.find()
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    async getContributors() {
        try {
            return contributors.find()
        } catch (err) {
            console.log(err)
            throw err
        }

    },

    async addContributors(data) {
        try {
            return contributors.create(data)
        } catch (err) {
            throw err
        }
    }

}