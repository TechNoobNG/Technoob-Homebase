const services = require('../services/index');
const resource = services.utils;


module.exports = {
    async upload_file(req, res, next) {
        const file = req.file
        try {
            const file_uloaded = await resource.upload_file(file)
            res.ok({
                status: "success",
                message: `file uploaded`,
                data: file_uloaded
            })
        } catch (error) {
            res.fail({
                status: "fail",
                message: error.message
            })
        }
    },

    async getPlaceholders(req, res) {
        try {
            const query = req.query;
            const fetchDefaults = await services.utils.getPlaceholders(query);
            res.ok({
                status: "success",
                message: `Fetched Successfully`,
                data: fetchDefaults
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }
    },

    async setPlaceholders(req, res) {
        try {
            const { placeholders, name } = req.body;

            const setDefaults = await services.utils.setPlaceholders({placeholders, name});
            res.ok({
                status: "success",
                message: `Defaults set`,
                data: setDefaults
            })
        } catch (err) {
            res.fail({
                status: "fail",
                message: err.message
            })
        }
    }
}