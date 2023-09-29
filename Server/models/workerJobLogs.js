const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workerLogs = new Schema({
    action: {
        type: String,
        trim: true
    },
    importService: {
        type: String,

    },
    payload: {
        type: Object,
    },
    status: {
        type: String,
        required: true
    },
    error_stack: {
        type: Object
    }
},{
    timestamps: true
});



module.exports = mongoose.model('WorkerLogs', workerLogs);
