const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const admin = controller.admin;
const middleware = require('../middleware/index');


router.get('/ip', middleware.auth.isAuthenticated,middleware.auth.hasPermission('admin:viewIPConfig') , (request, response) => {
    const ip = request.ip
    const ipHeaders = request.headers['x-forwarded-for'].split(',');
    const clientIp = ipHeaders[0];
    const remote = request.connection.remoteAddress;
    const hostname = request.hostname;
    const secure = request.secure;

    return response.json({
        ip,
        ipHeaders,
        clientIp,
        remote,
        hostname,
        secure
    })
});

router.get('/contributors', middleware.redisCache.getCache, admin.getContributors);
router.post('/contributors/add', middleware.auth.isAuthenticated,middleware.auth.hasPermission('admin:AddContributors'),admin.addContributors);
router.get('/dashboard', middleware.auth.isAuthenticated,middleware.auth.isAdmin, admin.dashboard);
router.get('/dashboard/traffic', middleware.auth.isAuthenticated, middleware.auth.isAdmin, admin.traffic);
router.post('/email/template',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageEmailTemplates'), admin.saveMailTemplate);
router.get('/email/template',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageEmailTemplates'),middleware.redisCache.getCache, admin.getMailTemplates);
router.get('/email/template/:id',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageEmailTemplates'),middleware.redisCache.getCache, admin.getMailTemplate);
router.post('/email/many/dynamic',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:SendMailNotifications'), admin.sendNotificationEmail);
router.post('/email/many/static',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:SendMailNotifications'), admin.sendNotificationEmailStatic);
router.post('/manage/invite', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageAdmins'), admin.inviteAdmin);
router.post('/manage/remove',middleware.auth.isAuthenticated,  middleware.auth.hasPermission('admin:ManageAdmins'), admin.removeAdmin);
router.get('/manage/view/all',middleware.auth.isAuthenticated,  middleware.auth.hasPermission('admin:ManageAdmins'), middleware.redisCache.getCache, admin.getAdmins);
router.get('/manage/view/:id',middleware.auth.isAuthenticated,  middleware.auth.hasPermission('admin:ManageAdmins'), middleware.redisCache.getCache, admin.getAdmin);
router.post('/permission/create', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManagePermissions'), admin.create_permission);
router.get('/permission/all', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManagePermissions'),middleware.redisCache.getCache, admin.get_permissions);
router.get('/permission/:id', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManagePermissions'),middleware.redisCache.getCache, admin.get_permission);
router.post('/permission/:id/delete',middleware.auth.isAuthenticated,  middleware.auth.hasPermission('admin:ManagePermissions'), admin.delete_permission);
router.post('/permission/:id/deactivate', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManagePermissions'), admin.deactivatePermission);
router.post('/permission/add', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManagePermissions'), admin.add_permission);
router.post('/permission/remove', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManagePermissions'), admin.remove_permission);
router.get('/mailing-list', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageMailingList'), admin.getMailingList);
router.post('/mailing-list', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageMailingList'), admin.addToMailingList);
router.post('/mailing-list/groups', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageMailingList'), admin.createMailingListGroup);
router.get('/contact-us',middleware.auth.isAuthenticated,  middleware.auth.hasPermission('admin:ManageContactUs'), admin.getContactUs);
router.post('/contact-us/:id/delete',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageContactUs'), admin.deleteContactUs);
router.post('/mailing-list/:id/delete',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageMailingList'), admin.deleteMailingList);
router.post('/frontend/resources/create',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:ManageFrontendResources'), admin.createFrontendResource);
router.get('/frontend/resources', admin.getFrontendResources);
router.get('/email/preview/:name', admin.previewEmailTemplate)
router.post('/worker/jobs/trigger',middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:TriggerWorkerJobs'), admin.triggerWorkerJobs);

module.exports = router;
