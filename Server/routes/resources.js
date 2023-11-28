const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const resources = controller.resources;
const middleware = require('../middleware/index');
const passport = require('../config/passportConfig')
router.get('/all',middleware.redisCache.getCache, resources.get_all)
router.get('/availablestacks', resources.getStacks)
router.get('/get/:id', resources.get)
router.get('/download/:id',middleware.auth.isAuthenticated, resources.download)
router.post('/create', middleware.auth.isAuthenticated,resources.create)
router.get('/count', resources.count)
router.post('/delete/:id', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:RemoveResource'),resources.remove)
router.post('/rate/:id', middleware.auth.isAuthenticated, resources.rate)
router.get('/activity',middleware.auth.isAuthenticated, resources.getActivity)
router.get('/metrics',passport.authenticate('session'), resources.getMetrics)

module.exports = router;
