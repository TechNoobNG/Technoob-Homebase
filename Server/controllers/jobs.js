const services = require('../services/index');
const jobs = services.jobs;

module.exports = {
     async get_all (req, res) {
        const query = req.query
        try {
            const job = await jobs.get_all(query)
            res.ok({
                status: "success",
                message: `${job.count} Job(s) retrieved`,
                data: job
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
            const job = await jobs.get(id,user)
            res.ok({
                status: "success",
                message: `Job retrieved`,
                data: job
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
            const jobsMetrics = await jobs.getMetrics()
            res.ok({
                status: "success",
                message: `Job metrics retrieved`,
                data: jobsMetrics
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
            const job = await jobs.create(payload)
            res.ok({
                status: "success",
                message: `Job created`,
                data: job,
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
            const count = await jobs.count()
            res.ok({
                status: "success",
                message: `job count`,
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
            await jobs.remove(id, req.user?._id )
            res.ok({
                status: "success",
                message: `Job deleted`,
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
            const activity = await jobs.activity(page,limit)
           return res.ok({
                status: "success",
                data: activity
            })
        } catch (err) {
           return res.fail({
                status: "fail",
                message: err.message
            })
        }
    },

    async scrape(req, res) {

        const { searchTags, posted, expires } = req.body;

        try {
            const scraper = require("../utils/automations/scraper")
            if (!searchTags || !searchTags.length) {
                throw new Error("Search tags should be an array")
            }
            if (!posted) {
                throw new Error("Posted age is required")
            }
            let resp = await scraper.scrapeJobsRSS({
                searchTags,
                age:posted,
                expires
            })
           
            res.ok({
                    status: "success",
                    data: resp,
                    statusCode: 201
                })
        } catch (err) {
            res.fail({
                    status: "fail",
                    message: err.message
                })
        }
    },

    async repushForApproval(req, res) {
        try {
            const triggerRepushForApproval =  await  jobs.repushForApproval()
           
            res.ok({
                    status: "success",
                    data: triggerRepushForApproval,
                    statusCode: 201
                })
        } catch (err) {
            res.fail({
                    status: "fail",
                    message: err.message
                })
        }
    }


}