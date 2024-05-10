const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const answerSchema = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  comment: {
    type: String,
  }
})
const competitionSubmissions = new Schema({
  date_submitted: {
    type: Date,
  },
      
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user id'],
    trim: true,
    index: true
  },

  quiz_id: {
    type: Schema.Types.ObjectId,
    ref: 'Quizzes',
    required: [true, 'Please provide quiz id'],
    trim: true,
    index: true
  },
  
  answers: {
    type: [answerSchema],
    default: []
  },
    

  score: {
    type: Number,
    default: 0,
    index: true
  },
  
  graded: {
    type: Boolean,
    default: false
  },
  
  gradedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    index: true
  },

  gradersComment: {
    type: String,
  }

},{
    timestamps: true
});


module.exports = mongoose.model('CompetitionSubmissions', competitionSubmissions);