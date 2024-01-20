const mongoose = require('mongoose');
const config = require(`${__dirname}/../config/config.js`)
const Schema = mongoose.Schema;

const leader_board = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  score: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quizAttempts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuizTracker"
  }]
},
{
  timestamps: true
}
);


leader_board.pre('save', async function (next) {
  if (this.isNew || this.isModified('quizAttempts')) {
    try {
      const QuizTracker = mongoose.model('QuizTracker');
      
      const quizAttempts = await QuizTracker.find({
        _id: { $in: this.quizAttempts },
      });

      const totalScore = quizAttempts.reduce((total, attempt) => total + attempt.score, 0);

      this.score = totalScore;
    } catch (error) {
      return next(error);
    }
  }

  next()
});



module.exports = mongoose.model('Leaderboard', leader_board);
