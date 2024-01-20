const mongoose = require('mongoose');
const config = require(`${__dirname}/../config/config.js`)
const Schema = mongoose.Schema;



const mailing_list = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
        unique: true
    },

},{
    timestamps: true
});



module.exports = mongoose.model('Mailing_list', mailing_list);
