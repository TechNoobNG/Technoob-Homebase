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
    graded: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
  },
    leaderboardEntry: {
      type: Schema.Types.ObjectId,
      ref: 'Leaderboard',
    },

},{
    timestamps: true
});

quizTracker.post('findOneAndUpdate', async function (doc) {
  try {
    const user = await mongoose.model('User').findById(this._conditions.user_id);

    if (user) {
      const updatedQuizTrackerId = doc._id;

      // Update the user's quiz record
      user.quiz_record.push(updatedQuizTrackerId);
      const new_record = user.quiz_record;
      await mongoose.model('User').findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { quiz_record: new_record } },
        { new: true }
      );

      let leaderboardEntry = await mongoose.model('Leaderboard').findOne({
        userId: user._id 
      });

      if (!leaderboardEntry) {
        leaderboardEntry =  await mongoose.model('Leaderboard').create({
          userId: user._id,
          quizAttempts: updatedQuizTrackerId
        });
      } else {
        await mongoose.model('Leaderboard').findOneAndUpdate(
          { _id: leaderboardEntry._id },
          { $addToSet: { quizAttempts: updatedQuizTrackerId } },
          { new: true }
        );
      }

      const quizRecords = await mongoose.model('QuizTracker').find({ user_id: user._id , completed: true});

      const totalScore = quizRecords.reduce((sum, record) => sum + record.score, 0);

      await mongoose.model('Leaderboard').findOneAndUpdate(
        { _id: leaderboardEntry._id },
        { score: totalScore },
        { new: true }
      );

      doc.leaderboardEntry = leaderboardEntry._id;
      await doc.save();
    }
  } catch (error) {
    throw new Error("Unable to update score,please contact admin")
  }
});




module.exports = mongoose.model('QuizTracker', quizTracker);