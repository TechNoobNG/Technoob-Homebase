const { array } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizTracker = new Schema({
    date_started: {
        type: Date,
      },
    
      duration_in_secs: {
        type: Number
      },
    
      user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user id'],
        trim: true
      },
    
      quiz_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quizzes',
        required: [true, 'Please provide quiz id'],
        trim: true
      },
    
      attempted: {
        type: Object,
        default: 0
      },
      
      maxAttempts: {
        type: Number,
        default: 3
      },
    
    score: {
      type: Number,
      default: 0
      },
      
    completed: {
        type: Boolean,
        default: false
      }

},{
    timestamps: true
});

quizTracker.post('findOneAndUpdate', async function (doc) {
  try {
      const user = await mongoose.model('User').findById(this._conditions.user_id);

      if (user) {
        const updatedQuizTrackerId = doc._id;

      user.quiz_record.push(updatedQuizTrackerId);
      const new_record = user.quiz_record;
      await mongoose.model('User').findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { quiz_record: new_record } },
        { new: true }
      );

      }
  } catch (error) {
     console.log(error)
  }
});
module.exports = mongoose.model('QuizTracker', quizTracker);