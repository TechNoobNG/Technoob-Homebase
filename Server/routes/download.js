const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const utils = controller.utils;
const middleware = require('../middleware/index');

router.get('/ses/download/:key/:bucket', utils.downloadEmail)
router.get('/:generatedId', middleware.auth.isAuthenticated, utils.downloadFile)
router.get('/status/:fileId', middleware.auth.isAuthenticated, utils.downloadComputed)
router.get('/public/:generatedId', utils.downloadFile)
module.exports = router;
