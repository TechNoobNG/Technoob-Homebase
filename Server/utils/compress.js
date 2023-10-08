
const { createGzip } = require('node:zlib');
const { Readable } = require('stream');
const uploadToBlob = require('../utils/multer_upload')

module.exports = function (file) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file) {
                throw new Error("Please provide a file");
            }

            const uploadedFileBuffer = file.buffer;

            const readable = new Readable();
            readable._read = () => { };
            readable.push(uploadedFileBuffer);
            readable.push(null);

            const gzip = createGzip();

            const compressedStream = readable.pipe(gzip);

            const uploadResponse = await uploadToBlob.uploadFileAsStream(compressedStream, `${file.originalname}.gz`, file.mimetype);

            resolve(uploadResponse);

        } catch (error) {
            console.error('Error compressing file:', error);
            reject(error);
        }
    });
}
