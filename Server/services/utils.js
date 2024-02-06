const uploader = require('../utils/multer/multer_upload')
const pool = require('../experimental/index')
const defaults = require('../models/defaults')
const ErrorResponse = require('../utils/error/errorResponse');
const storageService = require('../utils/storage/storageService')
const fileUploadHistory = require('../models/fileUploadHistory')
const computedDownloads = require('../models/computedDownloads')
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

    async download( generatedId, userId) {
        try {
            let checkFile = await fileUploadHistory.findOne({
                generatedId: generatedId
            })

            if (checkFile && checkFile.isRestricted && (checkFile.user_id !== userId || !checkFile.allowedUsers.includes(userId))) {
                throw new ErrorResponse(
                    401,
                    "You are not authorized to view this file"
                )
            }

            if (!checkFile) {
                checkFile = await computedDownloads.findOne({
                    generatedId: generatedId,
                    user_id: userId,
                    status: "completed"
                })
            }

            if (!checkFile) {
                throw new ErrorResponse(
                    404,
                    "Resource not found"
                )
            }

            const storeName = checkFile.objectStore;
            const type = checkFile.mimetype.split('/')[0];
            let key = checkFile.key || `${type}/${checkFile.fileName}`
            const download = await storageService.download({
                storeName,
                generatedId,
                key
            })
            return download
        } catch (error) {
            throw error
        }

    },

    async downloadSse( generatedId, userId) {
        try {
            const checkFile = await computedDownloads.findOne({
                generatedId: generatedId,
                user_id: userId,
                status: "completed"
            })


            if (!checkFile) {
                return false
            }

            // const storeName = checkFile.objectStore;
            // const type = checkFile.mimetype.split('/')[0];
            // let key = checkFile.key || `${type}/${checkFile.fileName}`
            // const download = await storageService.download({
            //     storeName,
            //     generatedId,
            //     key
            // })
            return checkFile.url
        } catch (error) {
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
    },

    async downloadEmail({key,bucket}) {
        try {
            const { download } = require("../utils/storage/aws_storage")
            const processDownload = await download({
                storeName: bucket,
                region: "eu-west-2",
                key: key
            })
            return processDownload
        } catch (error) {
            throw err
        }
    }

}