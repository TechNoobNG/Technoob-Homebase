const { tryCatch } = require('bullmq');
const Contact = require('../models/contact_us');
const mailing_list = require('../models/mailing_list');
const User = require('../models/user');
const leaderboard = require("./leaderboard");
const mongoose = require("mongoose");
const quizzes = require('./quizzes');
const ErrorResponse = require('../utils/errorResponse');


module.exports = {
    async edit(id, params) {
    if (!id || !params) {
      throw new ErrorResponse(
          404,
        "Quiz not found"
      )
    }
    const invalidKeys = ['password', 'passwordConfirm', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires', 'active', 'role', "passwordResetAttempt", "lockoutUntil" ,"passwordResetAttempt"]
    const invalidUpdate = Object.keys(params).some(key => invalidKeys.includes(key))
    if (invalidUpdate) {
          throw new ErrorResponse(
            400,
            'Invalid Parameters'
        )
    }

    try {
        const user = await User.findOneAndUpdate({ _id: id }, params, { new: true })
        return user
    } catch (err) {
        throw err
    }
    },

    async editPassword(id, password, previous_password) {
        try {
               if(!id || !password || !previous_password) throw new Error('Id, Password and Previous Password are required')
            const user = await User.findOne({ _id: id }).select('+password');
            const check = await user.comparePassword(previous_password,this.password)
            if (!check) {
                  throw new Error('Invalid Password, please check and retry')
            }
            user.password = password
            user.passwordConfirm = password
            await user.save()
            const response = {
                message: 'Password Updated Successfully'
            }
            return response
            }catch(err) {
                throw err
            }
    },

    async editPhoto(id, photo) {
        try {
            if(!id || !photo) throw new Error('Id and Photo are required')
            const user = await User.findByIdAndUpdate({ _id: id }, { photo: photo }, { new: true })
            return user
        } catch (err) {
            throw err
        }
    },

    async deactivate(id) {
        try {
            if (!id) throw new Error('Id is required')
            const user = await User.findByIdAndUpdate({ _id: id }, { active: false }, { new: true })
            return user
        } catch(err) {
            throw err
        }
    },

    async activate(id) {
        try {
            if (!id) throw new Error('Id is required')
            const user = await User.findByIdAndUpdate({ _id: id }, { active: true }, { new: true })
            return user
        } catch(err) {
            throw err
        }
    },

    async delete(id) {
        try {
            if (!id) throw new Error('Id is required')
            const deleted_user = await User.findByIdAndDelete({ _id: id })
            return deleted_user
        } catch (err) {
            throw err
        }
    },

    async getOne(id) {
        try {
            if (!id) throw new Error('Id is required')
            const user = await User.findById({ _id: id }).select('+active -password -createdAt -updatedAt -passwordResetAttempt -lockoutUntil -passwordResetAttempt').populate('quiz_record')
            return user
        } catch (err) {
            throw err
        }
    },

    async getAll(query) {
        try {
            let page = query.page || 1;
            let limit = query.limit || 5;
            let skip = (page - 1) * limit;
            let count = 0;
            const users = await User.find().select('+active -password -createdAt -updatedAt -passwordResetAttempt -lockoutUntil -passwordResetAttempt')
                .skip(skip)
                .limit(limit);
            if (users) {
                count = users.length
            }
            return {
                users,
                page,
                limit,
                count
            };
        } catch (err) {
            throw err
        }
    },

    async contact_us(name, email, message) {
        try {
            if (!name || !email || !message) throw new Error('Name, Email and Message are required')
            const contact = await Contact.create({ name, email, message })
            return contact
        } catch (err) {
            throw err
        }
    },

    async  mailing_list(email) {
        const temporaryDomains = [
            'tempmail.com',
            'guerrillamail.com',
            'mailinator.com',
        ];

        const [, domain] = email.split('@');
      if (temporaryDomains.includes(domain)) {
        throw new ErrorResponse(
          400,
          'Invalid Email Address'
        )
      }

      const response = await mailing_list.create({ email })
      return response

    },

    async getMetrics() {
        try {
            const users = await User.find().select('+active')
            const total = users.length
            const active = users.filter(user => user.active === true).length
            const inactive = users.filter(user => user.active === false).length
            return {
                total,
                active,
                inactive
            }
        } catch (err) {
            throw err
        }
    },

    /**
     * Retrieves the user's dashboard data from multiple collections in a MongoDB database.
     * The method fetches user information, quiz records, and matches resources, quizzes, and jobs based on the user's stack.
     * It also retrieves the user's ranking and leaderboard record.
     *
     * @param {string} id - The ID of the user for whom the dashboard is being fetched.
     * @returns {Object} - The dashboard data in the form of a 'dashObject' containing the following fields:
     *   - recommendations: An object containing matched quizzes, resources, and jobs based on the user's stack.
     *   - lastCompletedQuizAttempt: The details of the user's last completed quiz attempt.
     *   - pendingQuizzes: An array of pending quizzes for the user.
     *   - rank: The user's ranking.
     *   - leaderboardRecord: The user's leaderboard record.
     *   - leaderBoardUsers: The total number of users in the leaderboard.
     * @throws {Error} - If there is an error while fetching the dashboard data.
     */
    async getDashboard(id) {
        try {
            let dashObject = {
                recommendations: { }
            }
            const userId = new mongoose.Types.ObjectId(id);
            const aggregationPipeline =[
                {
                  $match: {
                    _id: userId,
                  },
                },
                {
                  $lookup: {
                    from: "quiztrackers",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "quiz_records",
                  },
                },
                {
                  $addFields: {
                    pendingQuizzes: {
                      $filter: {
                        input: "$quiz_records",
                        as: "quizRecord",
                        cond: {
                          $eq: ["$$quizRecord.completed", false],
                        },
                      },
                    },
                    lastCompletedAttempt: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: "$quiz_records",
                                as: "quizRecord",
                                cond: {
                                  $eq: ["$$quizRecord.completed", true],
                                },
                              },
                            },
                            as: "quiz",
                            in: {
                              quiz: "$$quiz",
                            },
                          },
                        },
                        -1,
                      ],
                    },
                  },
                },
                {
                  $project: {
                    email: 1,
                    stack: 1,
                    role: 1,
                    active: 1,
                    quiz_records: 1,
                    lastCompletedAttempt: 1,
                    pendingQuizzes: 1,
                  },
                },
                {
                  $unwind: "$stack",
                },
                {
                  $lookup: {
                    from: "resources",
                    let: {
                      stackValue: "$stack",
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$stack", "$$stackValue"],
                          },
                        },
                      },
                      {
                        $sort: {
                          createdAt: -1,
                        },
                      },
                      {
                        $limit: 4,
                      },
                    ],
                    as: "matched_resources",
                  },
                },
                {
                  $unwind: {
                    path: "$matched_resources",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "quizzes",
                    let: {
                      stackValue: "$stack",
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $eq: ["$stack", "$$stackValue"],
                          },
                        },
                      },
                      {
                        $sort: {
                          createdAt: -1,
                        },
                      },
                      {
                        $limit: 4,
                      },
                    ],
                    as: "matched_quizzes",
                  },
                },
                {
                  $unwind: {
                    path: "$matched_quizzes",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "jobs",
                    localField: "stack",
                    foreignField: "searchKeywords",
                    as: "matched_jobs",
                  },
                },
                {
                    $unwind: {
                      path: "$matched_jobs",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                {
                  $group: {
                    _id: "$_id",
                    email: {
                      $first: "$email",
                    },
                    stack: {
                      $addToSet: "$stack",
                    },
                    role: {
                      $first: "$role",
                    },
                    active: {
                      $first: "$active",
                    },
                    quiz_records: {
                      $first: "$quiz_records",
                    },
                    lastCompletedAttempt: {
                      $first: "$lastCompletedAttempt",
                    },
                    pendingQuizzes: {
                      $first: "$pendingQuizzes",
                    },
                    matched_resources: {
                      $addToSet: "$matched_resources",
                    },
                    matched_quizzes: {
                      $push: "$matched_quizzes",
                    },
                    matched_jobs: {
                      $addToSet: "$matched_jobs",
                    },
                  },
                },
                {
                  $project: {
                    _id: 1,
                    email: 1,
                    stack: 1,
                    role: 1,
                    active: 1,
                    quiz_records: 1,
                    lastCompletedAttempt: 1,
                    pendingQuizzes: 1,
                    matched_resources: {
                      _id: 1,
                      name: 1,
                      type: 1,
                      image_placeholder: 1,
                      stack: 1,
                    },
                    matched_jobs: {
                      $slice: ["$matched_jobs", 4], // Limit the number of jobs to 4
                    },
                    matched_quizzes: {
                      _id: 1,
                      deadline: 1,
                      type: 1,
                      theme: 1,
                      stack: 1,
                      datePosted: 1,
                    },
                  },
                },
              ];
          const user = await User.aggregate(aggregationPipeline);
          dashObject.recommendations.quiz = user[0].matched_quizzes
          dashObject.recommendations.resources = user[0].matched_resources
          dashObject.recommendations.jobs = user[0].matched_jobs
          dashObject.lastCompletedQuizAttempt = user[0].lastCompletedAttempt;
          dashObject.pendingQuizzes = user[0].pendingQuizzes;
          const getRanking = await leaderboard.getUser(userId);
          if (dashObject.lastCompletedQuizAttempt) {
            const getQuizAttemptInfo = await quizzes.get(user[0].lastCompletedAttempt.quiz.quiz_id);
            dashObject.lastCompletedQuizAttempt.quizInfo = getQuizAttemptInfo
          }
            dashObject.rank = getRanking.rank;
            dashObject.leaderboardRecord = getRanking.record;
            dashObject.leaderBoardUsers = getRanking.total;
            return dashObject
        } catch (error) {
             throw error
        }
    }

}
