const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const utils = controller.utils;
const middleware = require('../middleware/index');

router.get('/:generatedId', middleware.auth.isAuthenticated, utils.downloadFile)

module.exports = router;
