const workerpool = require("workerpool");
const utils = require("../utils/utils");
const compress = require("../utils/compress");
const upload = require("../utils/multer_upload")


workerpool.worker(
    {
        hash: utils.hashPassword,
        compress: compress,
        uploadFile: upload.uploadFile,
        uploadStream: upload.uploadFileAsStream
    }
);


