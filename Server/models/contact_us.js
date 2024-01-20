const mongoose = require('mongoose');
const config = require(`${__dirname}/../config/config.js`)
const Schema = mongoose.Schema;

const contact_us = new Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true,
        maxlength: [40, 'A user name must have less or equal then 40 characters']

    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
        unique: false
    },
    message: {
        type: String,
        required: [true, 'Please provide your Message'],
        unique: false

    }

},{
    timestamps: true
});



module.exports = mongoose.model('Contact_us', contact_us);
