
const multer = require('multer');
const sharp = require('sharp');
const storageService = require('../storage/storageService');
const stream = require('stream');
const userService = require('../../services/user');
const user = require('../../services/user');


const uploadParams = {
    limits: {
        fileSize: 8 * 1024 * 1024, // 8 MB file size limit for all file types except zip
    },
    fileFilter: (file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'text/csv', 'text/css', 'audio/mpeg', 'video/mp4', 'application/vnd.ms-powerpoint', 'application/vnd.rar'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type, only PDF, DOC, CSV, CSS, MP3, MP4, PPT, RAR, JPEG, and PNG files are allowed'));
        }
        cb(null, true);
    },
};



module.exports = {
    async uploadFile(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const fileName = `${timestamp}-${file.originalname}`;

                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                    const resizedImage = await sharp(file.buffer).resize(800).jpeg({ quality: 80 }).toBuffer();

                    uploadResponse = await storageService.upload({
                        type:'images',
                        data: resizedImage,
                        name: fileName,
                        acl: file.acl || "private"
                    });
                } else {
                    const sizeLimit = file.mimetype === 'application/zip' ? 15 * 1024 * 1024 : 30 * 1024 * 1024;
                    if (file.size > sizeLimit) {
                        throw new Error(`File size exceeds limit of ${sizeLimit / 1024 / 1024} MB`);
                    }
                    const uploadedFile = new stream.PassThrough();
                    uploadedFile.end(file.buffer);
                    const type = file.mimetype.split('/')[0];
                    uploadResponse = await storageService.upload({
                        type,
                        data: uploadedFile,
                        name: fileName,
                        isFile: true,
                        acl: file.acl || "private"
                    });
                }

                if (uploadResponse.generatedId) {
                    await userService.addUploads({
                        generatedId: uploadResponse.generatedId,
                        fileName: fileName,
                        size: file.size,
                        mimetype: file.mimetype,
                        uploaderId: file.uploaderId,
                        url: uploadResponse.url,
                        provider: uploadResponse.provider,
                        key: uploadResponse.key,
                    })
                }

                let response = {
                    name: fileName,
                    url: uploadResponse.url,
                    requestId: uploadResponse.requestId,
                    message: `File was uploaded successfully.`,
                    generatedId: uploadResponse.generatedId

                }
                resolve(response);
            } catch (err) {
                reject(err)
            }
        })

    },

    async uploadFileAsStream(fileStream, originalname, mimetype,uploaderId) {
        return new Promise(async (resolve, reject) => {
            try {
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const fileName = `${timestamp}-${originalname}`;

                if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
                    const resizedImageStream = fileStream.pipe(sharp().resize(800).jpeg({ quality: 80 }));

                    const uploadResponse = await storageService.upload({
                        type: 'images',
                        data: resizedImageStream,
                        name: fileName,
                        acl: file.acl || "private"
                    });


                if (uploadResponse.generatedId) {
                    await userService.addUploads({
                        generatedId: uploadResponse.generatedId,
                        fileName: fileName,
                        size: file.size,
                        mimetype: file.mimetype,
                        uploaderId: uploaderId,
                        url: uploadResponse.url,
                        provider: uploadResponse.provider,
                        key: uploadResponse.key,
                    })
                }

                    const response = {
                        name: fileName,
                        url: uploadResponse.url,
                        requestId: uploadResponse.requestId,
                        message: `File was uploaded successfully.`,
                        generatedId: uploadResponse.generatedId
                    };

                    resolve(response);
                } else {
                    const sizeLimit = mimetype === 'application/zip' ? 15 * 1024 * 1024 : 100 * 1024 * 1024;
                    let uploadedFileSize = 0;

                    const sizeCounterStream = new stream.Transform({
                        transform(chunk, encoding, callback) {
                            uploadedFileSize += chunk.length;
                            this.push(chunk);
                            callback();
                        }
                    });

                    fileStream.pipe(sizeCounterStream);

                    if (uploadedFileSize > sizeLimit) {
                        throw new Error(`File size exceeds limit of ${sizeLimit / 1024 / 1024} MB`);
                    }

                    const uploadResponse = await storageService.upload({
                        type: mimetype.split('/')[0],
                        data: sizeCounterStream,
                        name: fileName,
                        isFile: true,
                        acl: file.acl || "private"
                    });


                if (uploadResponse.generatedId) {
                    await userService.addUploads({
                        generatedId: uploadResponse.generatedId,
                        fileName: fileName,
                        size: file.size,
                        mimetype: file.mimetype,
                        uploaderId,
                        url: uploadResponse.url,
                        provider: uploadResponse.provider,
                        key: uploadResponse.key,
                    })
                }

                    const response = {
                        name: fileName,
                        url: uploadResponse.url,
                        requestId: uploadResponse.requestId,
                        message: `File was uploaded successfully.`,
                        generatedId: uploadResponse.generatedId
                    };

                    resolve(response);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                reject(error);
            }
        });
    }
}
