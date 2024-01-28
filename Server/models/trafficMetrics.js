const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trafficMetric = new Schema({
  endpoint: String,
  method: String,
  ip: String,
  noProxyIp: String,
  duration: String,
  userAgent: String,
  referer: String,
  requestBodySize: String,
  queryParameters: String,
  statusCode: String,
  body: Object

},{
  timestamps: true
});

module.exports = mongoose.model('TrafficMetric', trafficMetric);
