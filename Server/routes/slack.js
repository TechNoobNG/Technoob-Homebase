const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const slack = controller.slack;
const middleware = require('../middleware/index');
const TrafficMetric = require('../models/trafficMetrics');
const honeyBadger = require('../utils/honeybadger/honeybadger');

router.post('/action', async (req, res, next) => {
    const { method, originalUrl, ip } = req;
    const x_forwarded_for = req.headers['x-forwarded-for'];
    const noProxyIp = x_forwarded_for ? x_forwarded_for.split(',').shift() : req.connection.remoteAddress;
    const requestBodySize = Buffer.from(JSON.stringify(req.body)).length;
    const queryParameters = req.query ? JSON.stringify(req.query) : null;
    const headers = req.headers;
    const referer = headers.referer ? headers.referer : null;
    const userAgent = headers['user-agent'] ? headers['user-agent'] : null;
    const duration = req._startTime ? Date.now() - req._startTime : null;
    const statusCode = res.statusCode;
    const body = req.body

  try {
    const trafficMetric = new TrafficMetric({
        endpoint: originalUrl,
        method: method,
        ip,
        noProxyIp,
        duration,
        userAgent,
        referer,
        requestBodySize,
        queryParameters,
        statusCode,
        body,
        headers
    });

    await trafficMetric.save();

  } catch (error) {
    honeyBadger.notify(error);
    next();
  }
},middleware.auth.slackVerificationMiddleware ,slack.action)
 
module.exports = router;
