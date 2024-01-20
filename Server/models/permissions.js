const mongoose = require('mongoose');
const config = require(`${__dirname}/../config/config.js`)
const Schema = mongoose.Schema;

const permissions = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name of the permission'],
        unique: [true, 'This permission name is already taken'],
        trim: true
    },
    permission: {
        type: String,
        required: [true, 'Please provide permission'],
        unique: [true, 'This permission is already taken'],
        trim: true
    },
    team: {
        type: String,
        required: [true, 'Please provide team'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide description of the permission'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        trim: true
    },


},{
    timestamps: true
})

module.exports = mongoose.model('Permissions', permissions);