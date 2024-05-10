const mongoose = require('mongoose');
const config = require(`${__dirname}/../config/config.js`)
const Schema = mongoose.Schema;

const placeholderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isRequired: {
        type: Boolean,
        default: false
    },
    isImage: {
        type: Boolean,
        default: false
    },
    identifier: {
        type: String,
        required: true
    },
    isContent:  {
        type: Boolean,
        default: true
    },
    isUrl: {
        type: Boolean,
        default: false
    },
    isTime: {
        type: Boolean,
        default: false,
    },
    isDate: {
        type: Boolean,
        default: false
    }
})
const email = new Schema({
    template: {
        type: String,
        required: [true, 'Please provide html template'],
    },
    name: {
        type: String,
        required: [true, 'Please provide name of the template'],
        unique: [true, 'This template name is already taken'],
        trim: true
    },
    id: {
        type: String,
        required: [true, 'Please provide id of the template'],
        unique: [true, 'This template id is already taken'],
        trim: true
    },
    placeholders: {
        type: [placeholderSchema],
        default: []
    }
},{
    timestamps: true
});


module.exports = mongoose.model('Email', email);