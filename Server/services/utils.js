const uploader = require('../utils/multer_upload')
// const pool = require('../experimental/index')

module.exports = {
    async upload_file(file) {   
        try {
            const upload = await uploader.uploadFile(file)
           // const upload = await pool.exec('uploadFile', [file]);
            return upload
        } catch (error) {
            throw error
        }
    }
}