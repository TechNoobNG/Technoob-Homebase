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
    }
}