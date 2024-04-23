const mongoose = require('mongoose');
const config = require("../config/config")
const Schema = mongoose.Schema;
const User = require('./user');
const { clearCacheModelTriggers } = require("../middleware/redisCache");

const resources = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name of the resource'],
        unique: [true, 'This permission name is already taken'],
        trim: true
    },
    version: {
        type: Number,
        trim: true
    },
    stack: {
        type: String,
        required: [true, 'Please provide the applicable stack'],
        trim: true,
        enum: config.AVAILABLE_STACKS
    },
    description: {
        type: String,
        required: [true, 'Please provide description of the resouce'],
        trim: true
    },
    type: {
        type: String,
        default: true,
        trim: true,
        enum: config.AVAILABLE_RESOURCE_TYPE

    },

    file: {
        type: String,
        trim: true
    },

    url: {
        type: String,
        trim: true
    },

    uploader_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user id'],
        trim: true
    },

    image_placeholder: {
        type: String,
        trim: true
    },

    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date
    },

    meta: {
        type: Object,
        default: {}
    },

    ratings: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user id']
        },
        rating: {
            type: Number,
            required: [true, 'Please provide rating'],
            min: 1,
            max: 5
        }
    }],
    averageRating: {
        type: Number,
        default: null
    },

    users: {
        type: Object,
        default: []
    },

    downloads: {
        type: Number,
        default: 0,
        min:0 
    },

    traffic: {
        type: Number,
        default: 0,
        min: 0
    }


},{
    timestamps: true
})

resources.pre('save', async function (next) {
    const user = await User.findById({_id: this.uploader_id});
    if (!user) {
        this.uploader_id = null;
    }
    this.meta = {
        uploader: {
            id: user._id,
            name: user.firstname + ' ' + user.lastname,
            username: user.username,
            stack: user.stack
        }
    }
    const ratings = this.ratings;
    const totalRatings = ratings.length;
    let sum = 0;
    for (let i = 0; i < totalRatings; i++) {
        sum += ratings[i].rating;
    }
    this.averageRating = totalRatings > 0 ? sum / totalRatings : null;
    await clearCacheModelTriggers("resources")
    next();
});

resources.pre('findOneAndUpdate', async function(next) {
    const ratings = this.getUpdate().$push.ratings;
    const totalRatings = ratings.length;
    let sum = 0;
    for (let i = 0; i < totalRatings; i++) {
        sum += ratings[i].rating;
    }
    this.getUpdate().$set = { averageRating: totalRatings > 0 ? sum / totalRatings : null };
    await clearCacheModelTriggers("resources")
    next();
});
resources.pre('findOneAndUpdate', async function (next) { 
    this.updatedAt = Date.now();
    await clearCacheModelTriggers("resources")
    next();
});

resources.pre("deleteMany", async function (next) {
    await clearCacheModelTriggers("resources")
    next();
});
resources.pre("deleteOne", async function (next) {
    await clearCacheModelTriggers("resources")
    next();
});


module.exports = mongoose.model('Resources', resources);