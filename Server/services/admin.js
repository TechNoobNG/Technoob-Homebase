const Templates = require('../models/email_templates');
const uuid = require('uuid');
const Admin = require('../models/admin');
const Permissions = require('../models/permissions');
const User = require('../models/user');
const mailing_list = require('../models/mailing_list');
const contact_us = require('../models/contact_us');
const frontend_resources = require('../models/frontend_resources');
const contributors = require('../models/contributors');
const resources = require('../services/resources')
const users = require('../services/user');
const traffic = require('../services/traffic');
const ErrorResponse = require('../utils/errorResponse');
const MailService = require('../utils/mailer/mailService');
const mailService = new MailService();

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


    async saveMailTemplate(data) {

        return await Templates.create({
            name: data.name,
            template: data.template,
            id: uuid.v4()
        })
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
                method: "sendToManyStatic",
                data: mailOptions
            });

            return {
                message: "Email Queued Successfully"
            }
        } catch (err) {
            throw err
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