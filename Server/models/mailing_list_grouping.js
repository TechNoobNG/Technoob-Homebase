const mongoose = require('mongoose');
const config = require(`${__dirname}/../config/config.js`)
const Schema = mongoose.Schema;


const mailing_list_grouping = new Schema({
    groupName: {
        type: String,
        required: [true, 'Please provide the group name'],
        trim: true,
        unique: true
    },
    id: {
        type: String,
        required: [true, 'Please the Id'],
        trim: true,
        unique: true
    },
    owner: {
        type: String,
        trim: true
    }


},{
    timestamps: true
});



module.exports = mongoose.model('Mailing_List_Groups', mailing_list_grouping);
