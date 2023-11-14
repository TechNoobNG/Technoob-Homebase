const services = require('../services/index');
const resource = services.utils;


module.exports = {
    async upload_file(req, res, next) {
        const file = req.file
        try {
            const file_uloaded = await resource.upload_file(file)
            res.status(200).json({
                status: "success",
                message: `file uploaded`,
                data: file_uloaded
            })
        } catch (error) {
            res.status(400).json({
                status: "fail",
                message: error.message
            })
        }
    },

    async getPlaceholders(req, res) {
        try {
            const query = req.query;
            const fetchDefaults = await services.utils.getPlaceholders(query);
            res.status(200).json({
                status: "success",
                message: `Fetched Successfully`,
                data: fetchDefaults
            })
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err.message
            })
        }
    },

    async setPlaceholders(req, res) {
        try {
            const { placeholders, name } = req.body;

            const setDefaults = await services.utils.setPlaceholders({placeholders, name});
            res.status(200).json({
                status: "success",
                message: `Defaults set`,
                data: setDefaults
            })
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err.message
            })
        }
    }
}