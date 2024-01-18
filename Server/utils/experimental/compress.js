
const { createGzip } = require('node:zlib');
const { Readable } = require('stream');
const uploadToBlob = require('../multer/multer_upload')

module.exports = function ({
    uploadedFile,uploaderId
}) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!uploadedFile) {
                throw new Error("Please provide a uploadedFile");
            }

            const uploadedFileBuffer = uploadedFile.buffer;

            const readable = new Readable();
            readable._read = () => { };
            readable.push(uploadedFileBuffer);
            readable.push(null);

            const gzip = createGzip();

            const compressedStream = readable.pipe(gzip);

            const uploadResponse = await uploadToBlob.uploadFileAsStream(compressedStream, `${uploadedFile.originalname}.gz`, uploadedFile.mimetype, uploaderId);

            resolve(uploadResponse);

        } catch (error) {
            console.error('Error compressing uploadedFile:', error);
            reject(error);
        }
    });
}
