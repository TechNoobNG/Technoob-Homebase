const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const slack = controller.slack;
const middleware = require('../middleware/index');

router.post('/action',middleware.auth.slackVerificationMiddleware ,slack.action)

module.exports = router;
