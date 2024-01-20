const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const utils = controller.utils;
const middleware = require('../middleware/index');

router.post('/upload-file',middleware.auth.isAuthenticated, middleware.uploadStrategy.file, utils.upload_file)
router.post('/upload-image',middleware.auth.isAuthenticated, middleware.uploadStrategy.image, utils.upload_file)
router.get('/defaults',middleware.redisCache.getCache, utils.getPlaceholders)
router.post('/defaults',middleware.auth.isAuthenticated, middleware.auth.isAdmin, utils.setPlaceholders)
router.post('/scraper/logs',middleware.auth.loggerAuth, utils.createScrapperLog)
module.exports = router;
