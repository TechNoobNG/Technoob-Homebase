const services = require('../services/index');
const Quizzes = services.quizzes;

module.exports = {
     async get_all (req, res) { 
        const query = req.query
        try {
            const quizzes = await Quizzes.get_all(query)
            res.ok({
                status: "success",
                message: `${quizzes.count} quiz(es) retrieved`,
                data: quizzes
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async get(req, res, next) { 
        const id = req.params.id
        const user = req.user?._id || 0
        try {
            const quizzes = await Quizzes.get(id,user)
            res.status(201).json({
                status: "success",
                message: `Quiz retrieved`,
                data: quizzes
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async getMetrics(req, res, next) { 
        try {
            const quizzesMetrics = await Quizzes.getMetrics()
            res.ok({
                status: "success",
                message: `Quiz metrics retrieved`,
                data: quizzesMetrics
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async create (req, res, next) { 
        const payload = req.body

        payload.uploader_id = req.user?._id

        if (!payload.uploader_id) {
            throw new Error("Invalid user")
        }
        try {
            const quizzes = await Quizzes.create(payload)
            res.ok({
                status: "success",
                message: `Quiz created`,
                data: quizzes,
                statusCode: 201
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async count(req, res, next) {
        try {
            const count = await Quizzes.count()
            res.ok({
                status: "success",
                message: `Quiz count`,
                data: count
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async remove(req, res, next) {
        const id = req.params.id
        try {
            await quizzes.remove(id)
            res.ok({
                status: "success",
                message: `Quiz deleted`,
                statusCode: 204
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async getActivity(req, res, next) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        try {
            const activity = await Quizzes.activity(page,limit)
            res.ok({
                status: "success",
                data: activity
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }
    },

    async getQuestion(req, res, next) {
        const id = req.params.id
        const user = req.user

        try {
            const questions =  await Quizzes.getQuestion(id,user)
            res.ok({
                status: "success",
                data: questions,
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }

    },

    async getCompetitionSubmissions(req, res, next) {
        const query = req.query
        const user = req.user

        try {
            if (query.user_id && query.user_id !== user._id && user.role !== "admin") {
                query.user_id = user._id
            }
                
            const submissions =  await Quizzes.getCompetitionSubmissions(query)
            res.ok({
                status: "success",
                data: submissions,
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }

    },

    async getCompetitionSubmission(req, res) {
        const submissionId = req.params.id
        const user = req.user

        try {
            if (!submissionId) {
                throw new Error("Id is required")
            }
                
            const submission =  await Quizzes.getCompetitionSubmission(submissionId,user)
            res.ok({
                status: "success",
                data: submission,
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }

    },

    async gradeSubmission(req, res) {
        const submissionId = req.params.submissionId;
        const user = req.user;
        const { score, comment } = req.body;

        try {
            if (!submissionId) {
                throw new Error("Id is required")
            }
                
            const grade =  await Quizzes.gradeSubmission({submissionId,user, score, comment})
            res.ok({
                status: "success",
                data: grade,
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }

    },

    async gradeCompetitionSubmission(req, res) {
        const submissionId = req.params.id
        const user = req.user

        try {
            if (!submissionId) {
                throw new Error("Id is required")
            }
                
            const grade =  await Quizzes.gradeSubmission(submissionId,user)
            res.ok({
                status: "success",
                data: grade,
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }

    },

    async submit(req, res, next) {
        const id = req.params.id
        const answers = req.body.answers
        const user = req.user

        try {
            const result =  await Quizzes.submit(id,answers,user)
            res.ok({
                status: "success",
                data: result,
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }
    }

}