const services = require('../services/index');
const resource = services.resources;
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

module.exports = {
     async get_all (req, res) { 
        const query = req.query
        try {
            const resources = await resource.get_all(query)
            res.ok({
                status: "success",
                message: `${resources.count} resource(s) retrieved`,
                data: resources
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },
    getStacks(_req, res) {
        try {
            const stackOptions = config.AVAILABLE_STACKS
            res.ok({
                status: "success",
                message: `${stackOptions.count} stacks(s) retrieved`,
                data: stackOptions
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
            const resources = await resource.get(id,user)
            res.ok({
                status: "success",
                message: `resource retrieved`,
                data: resources
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
            const resources = await resource.getMetrics()
            res.ok({
                status: "success",
                message: `Resource Metrics retrieved`,
                data: resources
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async create (req, res, next) { 
        let payload = req.body
        payload.uploader_id = req.user?._id;

        if(! payload.uploader_id ) throw new Error("Invalid user")
        
        try {
            const resources = await resource.create(payload)
            res.ok({
                status: "success",
                message: `resource created`,
                data: resources,
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
            const count = await resource.count()
            res.ok({
                status: "success",
                message: `resource count`,
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
            const resources = await resource.remove(id, req.user?._id )
            res.ok({
                status: "success",
                message: `resource deleted`,
                data: resources,
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
            const activity = await resource.activity(page,limit)
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

    async download(req, res, next) {
        const id = req.params.id
        const user = req.user?._id || 0

        try {
            const resources = await resource.download(id, user)
            res.ok({
                status: "success",
                message: `resource downloaded`,
                data: resources
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async rate(req, res, next) {
        const id = req.params.id
        const rating = req.body
        if (!rating.user_id) {
            rating.user_id = req.user?._id || '643492bb86360e05476576f9'
        }
        try {
            const resources = await resource.rate(id, rating)
            res.ok({
                status: "success",
                message: `resource rated`,
                data: resources
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    }
}