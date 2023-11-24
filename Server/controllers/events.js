const services = require('../services/index');
const events = services.events;

module.exports = {
     async get_all (req, res) { 
        const query = req.query
        try {
            const event = await events.get_all(query)
            res.ok({
                status: "success",
                message: `${event.count} event(s) retrieved`,
                data: event
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
            const event = await events.get(id, user)
            res.ok({
                status: "success",
                message: `event retrieved`,
                data: event
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
            const eventsMetrics = await events.getMetrics()
            res.ok({
                status: "success",
                message: `event metrics retrieved`,
                data: eventsMetrics
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
            const event = await events.create(payload)
            res.status(201).json({
                status: "success",
                message: `event created`,
                data: event
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
            const count = await events.count()
            res.ok({
                status: "success",
                message: `event count`,
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
            await events.remove(id)
            res.ok({
                status: "success",
                message: `event deleted`
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
            const activity = await events.activity(page,limit)
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

}