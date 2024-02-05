const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { clearCacheModelTriggers } = require("../middleware/redisCache");

const jobs = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide the title of the job posting'],
    },
    company: {
        type: String,
        required: [true, 'Please provide the company'],
    },

    exp: {
        type: String,
        required: [true, 'Please provide the experience required'],
    },

    location: {
        type: String,
        required: [true, 'Please provide the location'],
    },

    workplaceType: {
        type: String,
        enum: ["onsite", "remote", "hybrid"],
        required: [true, 'Please provide the location'],
    },
    contractType:{
        type: String,
        enum: ["full-time", "contract","internship","part-time","gig"],
        required: [true, 'Please provide the contract type'],
    },

    datePosted: {
        type: Date,
        required: true,
    },

    expiryDate: {
        type: Date,
        required: [true, 'Please provide the expiry date'],
    },

    link: {
        type: String,
        required: true
    },

    poster: {
        type: String
    },

    comments: {
        type: Object,
        default: []
    },
    uploader_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user id'],
        trim: true
    },

    views: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },

    searchKeywords: {
        type: Schema.Types.Array,
        default: []
    },

    activityId: {
        type: String,
        required: false
    },

    meta: {
        type: Object,
        required: false
    },

    approved: {
        type: Boolean,
        required: false,
        default: false
    }

},{
    timestamps: true
});

jobs.pre("save", async function(next) {
    const jobTitle = this.title;
    const keywords = [];

    const words = jobTitle.split(' ');

    for (let i = 0; i < words.length; i++) {
        for (let j = i; j < words.length; j++) {
            const keyword = words.slice(i, j + 1).join(' ');
            keywords.push(keyword);
            keywords.push(keyword.toLowerCase());
        }
    }

    this.searchKeywords = [...this.searchKeywords, ...keywords];
    
    await clearCacheModelTriggers("jobs")
    next();
});

jobs.pre("findOneAndUpdate", async function (next) {
    await clearCacheModelTriggers("jobs")
    next();
});

jobs.pre("findOneAndDelete", async function (next) {
    await clearCacheModelTriggers("jobs")
    next();
});

jobs.pre("deleteMany", async function (next) {
    await clearCacheModelTriggers("jobs")
    next();
});
jobs.pre("deleteOne", async function (next) {
    await clearCacheModelTriggers("jobs")
    next();
});

module.exports = mongoose.model('Jobs', jobs);
