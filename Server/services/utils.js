const uploader = require('../utils/multer_upload')
const pool = require('../experimental/index')
const defaults = require('../models/defaults')

module.exports = {
    async upload_file(file) {   
        try {
            //const upload = await uploader.uploadFile(file)
            const upload = await pool.exec('uploadFile', [file]);
            return upload
        } catch (error) {
            throw error
        }
    },

    async getPlaceholders(query) {
        try {
            let filter = {};
    
            if (query) {
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
                throw new Error('Name is required');
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