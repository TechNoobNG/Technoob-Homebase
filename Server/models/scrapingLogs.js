const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scrapingLogs = new Schema({
    searchTags: {
        type: Array,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    scrapeResultLog: {
        type: Object,
    },
    age: {
        type: Number,
    },
    status: {
        type: String,
        required: true
    }
},{
    timestamps: true
});



module.exports = mongoose.model('scrapingLogs', scrapingLogs);
