const { admin } = require("../services/index")
const errorHandler = require("../utils/error/errorFormater");
const { sendMessage } = require('../utils/queues/queueService');

module.exports = {
    async dashboard(req, res) {
        try {
            const adminDashboard = await admin.adminDashboard();

            return res.ok({
                status: "success",
                message: `Dashboard details retrived successfully`,
                data: adminDashboard
            })
        } catch (error) {
            return res.fail(error)
        }
    },
    async traffic(req, res) {
        const range = req.query
        try {
            const trafficData = await admin.traffic(range);

            return res.ok({
                status: "success",
                message: `Traffic details retrieved successfully`,
                data: trafficData

            })
        } catch (error) {
            return res.fail(error)
        }
    },
    async saveMailTemplate(req, res) {
        try {
            const email_response = await admin.saveMailTemplate(req.body);

            return res.ok({
                status: "success",
                message: `Added email template to database`,
                data: email_response,
                statusCode: 201

            })
        } catch (error) {

             return res.fail(error)
        }
    },

    async inviteAdmin(req, res) {
        const inviter = req.user;
        const invitee = req.body.email
        try {
            const admin_response = await admin.inviteAdmin(invitee,inviter);
            return res.ok({
                status: "success",
                message: `Invited ${admin_response.user.username} to the platform`,
                data: admin_response
            })
        } catch (error) {

             return res.fail(error)
        }
    },

    async removeAdmin(req, res) {
        try {
            const admin_response = await admin.removeAdmin(req.body.email);
            return res.ok({
                status: "success",
                message: `Removed ${admin_response.user.username} as an admin`,
                data: admin_response,
                statusCode: 204
            })
        } catch (error) {
             return res.fail(error)
        }
    },

    async getMailTemplates(req, res) {
        const query = req.query
        try {
            const templates = await admin.getMailTemplates(query);
            return res.ok({
                status: "success",
                message: `Retrieved all email templates`,
                data: templates
            })
        } catch (error) {

             return res.fail(error)
        }
    },

    async getMailTemplate(req, res) {
        try {
            const template = await admin.getMailTemplate(req.params.id);
            return res.ok({
                status: "success",
                message: `Retrieved email template`,
                data: template
            })
        } catch (error) {

             return res.fail(error)
        }
    },

    async getAdmins(req, res) {
        try {
            const admins_list = await admin.getAdmins();
            return res.ok({
                status: "success",
                message: `Retrieved all admins`,
                data: admins_list
            })
        } catch (error) {

             return res.fail(error)
        }
    },

    async getAdmin(req, res) {
        try {
            const admin_info = await admin.getAdmin(req.params.id);
            return res.ok({
                status: "success",
                message: `Retrieved ${admin_info.user_id.username}`,
                data: admin_info
            })
        } catch (error) {

             return res.fail(error)
        }
    },

    async create_permission(req, res) {
        const data = {
            name: req.body.name,
            description: req.body.description,
        }
        const { team } = req.body;
        try {
            const permission = await admin.create_permission(team, data);
            return res.ok({
                status: "success",
                message: `Created permission`,
                data: permission,
                statusCode: 201
            })
        } catch (error) {
            return res.fail(error)
        }
    },

    async get_permissions(req, res) {
        try {
            const permissions = await admin.get_permissions();
            return res.ok({
                status: "success",
                message: `Retrieved all permissions`,
                data: permissions
            })
        } catch (error) {
            return res.fail(error)
        }
    },

    async get_permission(req, res) {
        try {
            const permission = await admin.get_permission(req.params.id);
            return res.ok({
                status: "success",
                message: `Retrieved permission`,
                data: permission
            })
        } catch (error) {
             return res.fail(error)
        }
    },

    async delete_permission(req, res) {
        try {
            const permission = await admin.delete_permission(req.params.id);
            return res.ok({
                status: "success",
                message: `Deleted permission`,
                data: permission,
                statusCode: 204
            })
        } catch (error) {
            return res.fail(error)
        }
    },

    async deactivatePermission(req, res) {
        try {
            const permission = await admin.deactivatePermission(req.params.id);
            return res.ok({
                status: "success",
                message: `Deactivated permission`,
                data: permission
            })
        }
        catch (error) {
           return res.fail(error)
        }
    },

    async add_permission(req, res) {
        const { email, permission } = req.body;

        try {
            const result = await admin.add_permission(email, permission);
            return res.ok({
                status: "success",
                message: `Added permission`,
                data: result,
                statusCode: 201
            })
        }
        catch (error) {
            return res.fail(error)
        }
    },

    async remove_permission(req, res) {
        const { email, permission } = req.body;
        try {
            const result = await admin.remove_permission(email, permission)
            return res.ok({
                status: "Success",
                message: "Permission removed successfully",
                data: result,
                statusCode: 204
            })
        } catch (error) {
             return res.fail(error)
        }

    },

    async sendNotificationEmail(req, res) {
        const { emails, subject, message ,template_id } = req.body;
        const content = {
            subject: subject,
            message: message,
            emails: emails,
            template_id: template_id
        }

        try {
            const sender = await admin.sendNotificationEmail(content);
            return res.ok({
                status: "success",
                message: `Sent email`,
                data: sender
            })
        }
        catch (error) {
            return res.fail(error)
        }
    },

    async sendNotificationEmailStatic(req, res) {
        const { emails, subject, message,template_id } = req.body;
        const content = {
            subject: subject,
            message: message,
            emails: emails,
            template_id: template_id
        }

        try {
            const sender = await admin.sendNotificationEmailStatic(content);
            return res.ok({
                status: "success",
                message: `Sent email`,
                data: sender
            })
        }
        catch (error) {
            return res.fail(error)
        }
    },

    async getMailingList(req, res) {
        try {
            const query = req.query
            const mailingList = await admin.getMailingList(query);
            return res.ok({
                status: "success",
                message: `Retrieved mailing list`,
                data: mailingList
            })
        }
        catch (error) {
            return res.fail(error)

        }
    },

    async deleteMailingList(req, res) {
        try {
            const mailingList = await admin.deleteMailingList(req.params.id);
            return res.ok({
                status: "success",
                message: `Deleted mailing list`,
                data: mailingList,
                statusCode: 204
            })
        }
        catch (error) {
            return res.fail(error)

        }
    },

    async getContactUs(req, res) {
        try {
            const contactUs = await admin.getContactUs();
            return res.ok({
                status: "success",
                message: `Retrieved contact us`,
                data: contactUs
            })
        }
        catch (error) {

             return res.fail(error)

        }
    },

    async deleteContactUs(req, res) {
        try {
            const contactUs = await admin.deleteContactUs(req.params.id);
            return res.ok({
                status: "success",
                message: `Deleted contact us`,
                data: contactUs,
                statusCode: 204
            })
        }
        catch (error) {
            return res.fail(error)

        }
    },

    async getContactUsMessage(req, res) {
        try {
            const contactUs = await admin.getContactUsMessage(req.params.id);
            return res.ok({
                status: "success",
                message: `Retrieved contact us`,
                data: contactUs
            })
        }
        catch (error) {

             return res.fail(error)

        }
    },

    async createFrontendResource(req, res) {
        const { name, description, url } = req.body;
        try {
            const resource = await admin.createFrontendResource({ name, description, url });
            return res.ok({
                status: "success",
                message: `Created frontend resource`,
                data: resource,
                statusCode: 201
            })
        }
        catch (error) {

             return res.fail(error)

        }
    },

    async getFrontendResources(req, res) {
        const { name, description, url } = req.body;
        try {
            const resources = await admin.getFrontendResources({ name, description, url });
            return res.ok({
                status: "success",
                data: resources,
                statusCode: 200
            })
        }
        catch (error) {

             return res.fail(error)

        }
    },

    async getContributors(req, res) {
        try {
            const contributors = await admin.getContributors();
            return res.ok({
                status: "success",
                message: `Retrieved Contributors`,
                data: contributors
            })
        }
        catch (error) {

             return res.fail(error)

        }
    },

    async addContributors(req, res) {
        const { first_name, last_name, designation, image } = req.body;
        try {
            const contributor = await admin.addContributors({ first_name, last_name, designation,image});
            return res.ok({
                status: "success",
                message: `Added Contributor`,
                data: contributor,
                statusCode: 201
            })
        }
        catch (error) {

             return res.fail(error)

        }
    },
    async triggerWorkerJobs(req, res) {
        const { name, importString , service, method,data } = req.body;
        try {
            const addToQueue = await sendMessage({
                name: name,
                import: importString,
                service: service,
                method: method,
                data: data,
                visibilityTimeout: 40,
                delay: 3000
            })

            return res.ok({
                status: "success",
                message: `Created Task for worker`,
                data: addToQueue
            })
        }
        catch (error) {
             return res.fail(error)

        }
    },

}