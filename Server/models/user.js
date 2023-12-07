const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const SALT_ROUNDS = config.SALT_ROUNDS
const TOKEN_EXPIRATION_TIME = config.TOKEN_EXPIRATION_TIME;
const child_worker = require('../utils/child');
const Honeybadger = require('../utils/honeybadger');

const employmentHistorySchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
  },
  country: {
    type: String,
  },
});

const user = new Schema({
    firstname: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true,
        maxlength: [40, 'A user name must have less or equal then 40 characters']

    },
    lastname: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Please provide your username'],
        unique: [true, 'This username is already taken'],
        trim: true

    },
    google_id: {
        type: String,
        unique: true,
        sparse: true
    },
    github_id: {
        type: String,
        unique: true,
        sparse: true

    },
    github_meta: {
        type: Object,
        default: {}
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    stack: {
        type: Array,
        required: [true, 'Please provide your stack']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'A password must have more or equal then 8 characters'],
        select: false
    },

    passwordConfirm: {
        type: String,
        // validate: {
        //     validator: function (el) {
        //         return el === this.password;
        //     }
        // },
        // message: 'Passwords are not the same!'

    },
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verificationToken: {
        type: String
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockoutUntil: {
        type: Date,
        default: null
    },

    passwordResetAttempt: {
        type: Number,
        default: 0
    },

    quiz_record: [{
        type: Schema.Types.ObjectId,
        ref: 'QuizTracker' 
    }],
    country: String,
    bio: String,
    employmentHistory: {
        type: [employmentHistorySchema],
        default: [],
    },

},{
    timestamps: true
});

user.pre('save', async function (next) {
  try {
      // Only run this function if password was actually modified
      if (!this.isModified('password')) return next();
      if (this.passwordConfirm !== this.password) {
          throw new Error("Please confirm your password")
      }
      if (child_worker.checkChild() > 0) { 
        try {
            const [hash] = await Promise.all([
              child_worker.work({ activity: 'Hashing', payload: { password: this.password } })
            ]);
          
            this.password = hash;
        } catch (err) {
            console.log(err)
            Honeybadger.notify(`Password hashing failed with error: ${err}`);
            const salt =  await bcrypt.genSalt(SALT_ROUNDS)
            this.password = await bcrypt.hash(this.password, salt);
          }
      } else {
        const salt =  await bcrypt.genSalt(SALT_ROUNDS)
        this.password = await bcrypt.hash(this.password, salt);
      }

    this.passwordConfirm = undefined;
    this.passwordChangedAt = Date.now() - 1000;
    next();
  } catch (error) {
    throw error
  }
});


user.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
}
);

user.methods.comparePassword = async function (password) {
    if (!password) {
        return false;
    }

    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}


user.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    return false;
}

user.virtual('lastCompletedAttempt').get(function () {
    const quizRecord = this.quiz_record;
    if (quizRecord.length > 0) {
      const sortedQuizRecords = quizRecord.slice().sort((a, b) => b.updatedAt - a.updatedAt);
      const mostRecentAttempt = sortedQuizRecords.find((quiz) => quiz.completed);
      if (mostRecentAttempt) {
        return mostRecentAttempt;
      }
    }
    return null;
  });
  
  user.virtual('pendingQuizzes').get(function () {
    return this.quiz_record.filter((quiz) => !quiz.completed);
  });
  


const UserModel = mongoose.model('User', user);
module.exports = UserModel;

