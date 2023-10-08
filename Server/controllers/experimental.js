const experimental = require("../services/experimental.js")

module.exports = {
    compressFile: async function (req,res) {
        try {
            if (!req.file) {
              return res.status(400).send('No file uploaded.');
            }
        
            const uploadedFile = req.file;
            const compressedFile = await experimental.compressFile(uploadedFile);

            res.status(200).json({
                status: "success",
                message: `File Compressed`,
                data: compressedFile
            })

          } catch (error) {
            res.status(500).send('Error compressing file.');
          }
    }
}