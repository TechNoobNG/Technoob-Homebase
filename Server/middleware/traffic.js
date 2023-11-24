const TrafficMetric = require('../models/trafficMetrics');
const honeyBadger = require('../utils/honeybadger');

const trafficMetrics = (req, res, next) => {
  const { method, originalUrl,ip } = req;
  
  try {
    const trafficMetric = new TrafficMetric({
      endpoint: originalUrl,
      method: method,
      ip,
      
    });

    trafficMetric.save();
    
  } catch (error) {
    honeyBadger.notify(error);
    next();
  }
  next();
};

module.exports = trafficMetrics;
