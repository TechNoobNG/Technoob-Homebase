const uploader = require('../utils/multer_upload')
const pool = require('../experimental/index')
const defaults = require('../models/defaults')
const ErrorResponse = require('../utils/errorResponse');
const storageService = require('../utils/storage/storageService')
const fileUploadHistory = require('../models/fileUploadHistory')
module.exports = {
    async upload_file(file) {
        try {
            const upload = await uploader.uploadFile(file)
            //const upload = await pool.exec('uploadFile', [file]);
            return upload
        } catch (error) {
            throw error
        }
    },

    async download(storeName, generatedId, userId) {
        try {
            const checkFile = await fileUploadHistory.findOne({
                generatedId: generatedId,
                user_id: userId,
            })

            if (!checkFile) {
                throw new ErrorResponse(
                    404,
                    "Resource not found"
                )
            }
            const type = checkFile.mimetype.split('/')[0];
            let key = checkFile.key || `${type}/${checkFile.fileName}`
            const download = await storageService.download({
                storeName,
                generatedId,
                key
            })
            //const download = await pool.exec('download', [storeName, generatedId]);
           // const download = await
            return download
        } catch (error) {
            console.log(error)
            throw error
        }

    },

    async getPlaceholders(query) {
        try {
            let filter = {};

            if (query && Object.keys(query).length) {
                const names = Object.keys(query);
                filter = { name: { $in: names } };
            }

            const placeholders = await defaults.find(filter);

            return placeholders;
        } catch (err) {
            throw err;
        }
    },


    async setPlaceholders({ placeholders, name }) {
        try {
            if (!name) {
                throw new ErrorResponse(
                    404,
                    'Name is required'
                )
            }

            const newEntry = await defaults.create({
                name: name,
                defaults: placeholders
            });

            return newEntry;
        } catch (err) {
            throw err;
        }
    }


}