const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { clearCacheModelTriggers } = require("../middleware/redisCache");

const contributor = new Schema({
    first_name: {
        type: String,
        required: [true, 'Please provide first name'],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, 'Please provide last name'],
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Please provide user image'],
    }
},{
    timestamps: true
});

contributor.pre("save", async function(next) {
    await clearCacheModelTriggers("contributors")
    next();
});

contributor.pre("findOneAndUpdate", async function (next) {
    await clearCacheModelTriggers("contributors")
    next();
});

contributor.pre("findOneAndDelete", async function (next) {
    await clearCacheModelTriggers("contributors")
    next();
});

contributor.pre("deleteMany", async function (next) {
    await clearCacheModelTriggers("contributors")
    next();
});
contributor.pre("deleteOne", async function (next) {
    await clearCacheModelTriggers("contributors")
    next();
});



module.exports = mongoose.model('Contributors', contributor);
