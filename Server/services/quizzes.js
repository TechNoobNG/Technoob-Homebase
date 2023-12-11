const Quizzes = require('../models/quizzes');
const Activity = require('../models/activity');
const QuizTracker = require('../models/quizTracker')
const ErrorResponse = require('../utils/error/errorResponse');

module.exports = {
    get_all: async (query) => {
        try {
            let prompt = {};
            let page = query.page || 1;
            let limit = query.limit || 5;
            let skip = (page - 1) * limit;
            let count = 0;
            if (query.theme) {
                prompt.theme = { $regex: query.theme, $options: 'i' };
            }
            if (query.type) {
                prompt.type = query.type;
            }
            if (query.stack) {
                prompt.stack = query.stack;
            }
            if (query.live) {
                prompt.expiryDate =  {
                    $gte: new Date()
                  }
            }

            const quiz = await Quizzes.find(prompt)
                .skip(skip)
                .limit(limit);

            if (quiz) {
                count = quiz.length
            }

            const quizzes = quiz.map((quiz) => {
                quiz.questions_answers = []
                return quiz
            })
            return {
                quizzes,
                page,
                limit,
                count
            };
        } catch (error) {
            throw error;
        }
    },

    get: async (id) => {
        try {
            const quizzes = await Quizzes.findById(id).select('theme type stack duration deadline');
            if (!quizzes) {
                throw new ErrorResponse(
                    404,
                    "No Quiz/Competition found"
                )
            }
            return quizzes;
        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try {
            const quizzes = await Quizzes.create(body);
            if (quizzes) {
                const activity = {
                    user_id: quizzes.uploader_id,
                    module: "quizzes",
                    activity: {
                        activity: quizzes.type === 'quiz' ? "Quiz Upload" : "Competition Upload",
                        theme: quizzes.theme,
                        type: quizzes.type,
                        stack: quizzes.stack,
                        duration: quizzes.duration,
                        deadline: quizzes.deadline,
                        status: "Successful"
                    }
                }

                await Activity.create(activity)
            }
            return quizzes;
        } catch (error) {
            const activity = {
                user_id: body.uploader_id,
                module: "quizzes",
                activity: {
                    activity: body.type === 'quiz' ? "Quiz Upload" : "Competition Upload",
                    theme: body.theme,
                    type: body.type,
                    stack: body.stack,
                    duration: body.duration,
                    deadline: body.deadline,
                    status: "Failed"
                }
            }
            await Activity.create(activity)
            throw error;
        }
    },

    count: async () => {
        try {
            const count = await Quizzes.countDocuments();
            return count;
        } catch (error) {
            throw error;
        }
    },

    activity: async (page, limit) => {
        const skip = (page - 1) * limit;
        let count = 0
        try {
            const activity = await Activity.find({
                module: "quizzes"
            }).skip(skip).limit(limit)
            if (activity) {
                count = activity.length
            }

            return {
                activity,
                page,
                limit,
                count
            }
        } catch (error) {
            throw error
        }
    },

    remove: async (id) => {
        try {
            const quiz = this.get(id)
            if (quiz) {
                await Quizzes.findByIdAndDelete(id);
                const activity = {
                    user_id: quiz.uploader_id,
                    module: "quiz",
                    activity: {
                        activity: "quiz Removal",
                        theme: quiz.theme,
                        location: quiz.location,
                        ticketing: quiz.ticketing,
                        date: quiz.date,
                        price: quiz.price,
                        currency: quiz.currency,
                        status: "Successful"
                    }
                }

                await Activity.create(activity)
            } else {
                throw new Error("quiz does not exist")
            }
            return null
        } catch (error) {
            throw error;
        }
    },

    getMetrics: async () => {
        try {
            const quizzes = await Quizzes.find();
            let total = quizzes.length

            return {
                total
            };
        } catch (error) {
            throw error;
        }
    },

    getQuestion: async (id,user) => {
        try {
            const quiz = await Quizzes.findById(id);

            if (!quiz) {
                throw new ErrorResponse(
                    404,
                    "Quiz not found"
                )
            }
            const excludeCorrectAnswer = quiz.questions_answers.map((question) => {
                delete question.correctAnswerId
                return question
            })
            quiz.questions_answers = excludeCorrectAnswer

            const attempt = {
                user_id: user._id,
                quiz_id: quiz._id,
                duration_in_secs: quiz.duration || (quiz.deadline && Math.floor((new Date(quiz.deadline).getTime() - new Date().getTime()) / 1000))
            }
            const options = { upsert: true, new: true };
            await QuizTracker.findOneAndUpdate({quiz_id: id,user_id: user._id}, attempt, options)
            return quiz

        } catch (error) {
            ;
            throw error;
        }
    },

    submit: async (id, answerObj, user) => {
        try {
            let score = 0;
            let tracker = {};
            const quiz = await Quizzes.findById(id);
            if (!quiz) {
                throw new ErrorResponse(
                    404,
                    "Quiz not found"
                )
            };
            const totalQuestions = quiz.questions_answers.length;

            const currentQuizTracker = await QuizTracker.findOne({ quiz_id: id, user_id: user._id });
            if (!currentQuizTracker) throw new Error("Quiz not Started")
            if (currentQuizTracker && currentQuizTracker.completed) throw new Error("Quiz already completed");
            if (!(currentQuizTracker && Date.now() < currentQuizTracker.createdAt.getTime() + (currentQuizTracker.duration_in_secs * 1000))) throw new Error("Quiz time has elapsed");
            if (currentQuizTracker.attempted >= currentQuizTracker.maxAttempts) throw new Error("Maximum number of attempts reached");
            if (currentQuizTracker.attempted === undefined || Number.isNaN(currentQuizTracker.attempted)) currentQuizTracker.attempted  = 0
            await answerObj.forEach(async (userAnswer, index) => {
                const question = quiz.questions_answers.find((q) => q.id === userAnswer.questionId);
                if (question && userAnswer.selectedAnswerId === question.correctAnswerId) {
                    score++;
                }
            });

            tracker.completed = true;
            tracker.score = score;
            tracker.attempted = currentQuizTracker.attempted + 1;

            await QuizTracker.findOneAndUpdate({ quiz_id: id, user_id: user._id }, tracker);

            return {
                score,
                totalQuestions,
            };

        } catch (error) {
            console.log
            throw error;
        }
    },

    fetchUserRecommendations: async (stack) => {
        try {
            const searchRecommendations = await Quizzes.find({
                stack: {
                    $in: stack
                }
            },
            {
                _id: 1,
                theme: 1,
                type: 1,
                duration: 1,
                stack: 1

              })
            return searchRecommendations
        } catch (err) {
            console.log(err)
        }
    }
};
