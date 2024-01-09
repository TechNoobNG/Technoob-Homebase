const experimental = require("../services/experimental.js")
const computedDownloads = require("../models/computedDownloads")
const uuid = require("uuid")
module.exports = {
    compressFile: async function (req,res) {
        try {
            if (!req.file) {
              return res.status(400).send('No file uploaded.');
            }

          const uploadedFile = req.file;
          uploadedFile.uploaderId = req.user._id
          const compressedFile = await experimental.compressFile(uploadedFile);

          res.ok({
              status: "success",
              message: `File Compressed`,
              data: compressedFile
          })

          } catch (error) {
            res.fail('Error compressing file.');
          }
  },

  mockJob: async function (req,res) {
    const fileId = uuid.v4();
    const channel = `download:${fileId}`;

    const createEntry = await computedDownloads.create({
      generatedId: fileId,
      fileName: channel,
      user_id: req.user._id,
      status: 'in-progress',
      url: null
    })

    if(createEntry) {
      res.ok({
        status: 'success',
        message: 'Download initiated',
        data: {
          fileId: fileId,
          channelId: channel,
        }
      })
    }


    await experimental.mockJob(fileId, channel);

  }
}