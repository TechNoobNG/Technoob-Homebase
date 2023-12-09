const TrafficMetric = require('../models/trafficMetrics');
const honeyBadger = require('../utils/honeybadger');

const saveTrafficMetric = (req, res, next) => {

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
      statusCode
    });

    trafficMetric.save();

  } catch (error) {
    honeyBadger.notify(error);
    next();
  }
  next();
};

const trafficMetrics = (req, res, next) => {
  try {
    req._startTime = Date.now();
    req.postExecMiddlewares = (req.postExecMiddlewares || []).concat(saveTrafficMetric);
  } catch (error) {
    console.warn(error.message);
    honeyBadger.notify(error);
  }
  next();
  return;
}

module.exports = trafficMetrics;
