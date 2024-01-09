const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const computedDownloadsSchema = new mongoose.Schema({
    generatedId: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        },
    mimetype: {
        type: String,
        },
    user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user id'],
            trim: true
        },
    url: {
        type: String,
    },
    provider: {
        type: String,
    },
    key: {
        type: String,
    },
    objectStore: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending","in-progress", "completed", "failed"],
    }
}, {
timestamps: true,
});

const ComputedDownloads = mongoose.model('ComputedDownloads', computedDownloadsSchema);

module.exports = ComputedDownloads;
