const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config')
const { clearCacheModelTriggers } = require("../middleware/redisCache");

const quizzes = new Schema({
    theme: {
        type: String,
        required: [true, 'Please provide the theme of the Quiz/Competition'],
    },

    type: {
        type: String,
        enum: config.AVAILABLE_QUIZ_TYPE,
        required: true
    },
    stack: {
        type: String,
        required: [true, 'Please provide the stack for the quiz'],
        enum: config.AVAILABLE_STACKS
    },

    instructions: {
        type: String,
        required: [true, 'Please provide the quiz instructions'],
    },

    questions_answers: {
        type: Array,
        required: [true, 'Please provide the questions'],
        default: []
    },

    duration: {
        type: Number
    },

    deadline: {
        type: Date 
    },

    uploader_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user id'],
        trim: true
    },

    leader_Board: {
        type: Object,
        default: []
    },
    maxAttempts: {
        type: Number,
        default: 3
    },

},{
    timestamps: true
});

quizzes.pre("save", async function(next) {
    await clearCacheModelTriggers("quizzes")
    next();
});

quizzes.pre("findOneAndUpdate", async function (next) {
    await clearCacheModelTriggers("quizzes")
    next();
});

quizzes.pre("findOneAndDelete", async function (next) {
    await clearCacheModelTriggers("quizzes")
    next();
});

quizzes.pre("deleteMany", async function (next) {
    await clearCacheModelTriggers("quizzes")
    next();
});
quizzes.pre("deleteOne", async function (next) {
    await clearCacheModelTriggers("quizzes")
    next();
});


module.exports = mongoose.model('Quizzes', quizzes);