const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const quizzes = new Schema({
    theme: {
        type: String,
        required: [true, 'Please provide the theme of the Quiz/Competition'],
    },

    type: {
        type: String,
        enum: ["quiz", "competition"],
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
        type: Object,
        required: [true, 'Please provide the questions'],
        default: {}
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


module.exports = mongoose.model('Quizzes', quizzes);