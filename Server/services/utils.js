const uploader = require('../utils/multer/multer_upload')
const pool = require('../experimental/index')
const defaults = require('../models/defaults')
const ErrorResponse = require('../utils/error/errorResponse');
const storageService = require('../utils/storage/storageService')
const fileUploadHistory = require('../models/fileUploadHistory')
const computedDownloads = require('../models/computedDownloads')
const config = require('../config/config')
const uuid = require('uuid');

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

    async uploadFileExternal({ key, bucket, size,mimetype,provider }) {
        try {
            if(!key || !bucket){
                throw new ErrorResponse(400, "key and bucket are required")
            }
    
            const  generatedId = uuid.v4();
            const params = {
                fileName: key,
                generatedId,
                size:   Number.parseInt(size),
                mimetype: mimetype,
                user_id: "64feb85db96fbbd731c42d5f",
                key: key,
                objectStore: bucket,
                provider: provider || "aws",
                url:  `https://${config.LIVE_BASE_URL}/api/v1/download/public/${generatedId}`
            }
            await fileUploadHistory.create(params)
            return {
                generatedId,
                url: params.url
            }
        } catch (error) {
            throw error
        }
    },

    async download( generatedId, userId) {
        try {
            let checkFile = await fileUploadHistory.findOne({
                generatedId: generatedId
            })

            if (!checkFile) {
                checkFile = await computedDownloads.findOne({
                    generatedId: generatedId,
                    status: "completed"
                })
            }
            

            if (checkFile && checkFile.isRestricted) {
                if (!userId || (checkFile.user_id !== userId && !checkFile.allowedUsers.includes(userId))) {
                    throw new ErrorResponse(
                        401,
                        "You are not authorized to view this file"
                    );
                }
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

            const placeholdersArray = await defaults.find(filter);
            const placeholders = placeholdersArray.map(placeholder => placeholder.defaults);
            return placeholders.reduce((acc, cur) => ({ ...acc, ...cur }), {});
        } catch (err) {
            throw err;
        }
    },

    setPlaceholderEnvsV1(defaults) {
        process.env.AVAILABLE_STACKS = JSON.stringify(defaults.stacks);
        process.env.AVAILABLE_COUNTRIES = JSON.stringify(defaults.countries);
        process.env.AVAILABLE_CONTRACT_TYPE = JSON.stringify(defaults.contractType);
        process.env.AVAILABLE_QUIZ_TYPE = JSON.stringify(defaults.quizType);
        process.env.AVAILABLE_RESOURCE_TYPE = JSON.stringify(defaults.resourceType);
        process.env.AVAILABLE_WORK_PLACE_TYPE = JSON.stringify(defaults.workPlaceType);
        return true;
    },  
    
    setPlaceholderEnvs(defaults) {
        try {
            Object.keys(defaults).forEach(key => {
                const snakeCaseKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
                process.env[`AVAILABLE_${snakeCaseKey}`] = JSON.stringify(defaults[key]);
            });
            return true;
        } catch (error) {
            return false;
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