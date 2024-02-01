const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const slack = controller.slack;
const middleware = require('../middleware/index');


router.post('/action', middleware.auth.slackAuth, slack.action)
router.post('/menus', middleware.auth.slackAuth, slack.menus)
router.post('/action/commands', middleware.auth.slackAuth ,slack.commands)
 
module.exports = router;
