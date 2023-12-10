const env = process.env.NODE_ENV || 'development';
const config = require(`../../config/config`)[env];

const mongoose = require('mongoose');
mongoose.connect(config.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;
module.exports = database;