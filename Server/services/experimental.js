const workerpool = require('workerpool');


const pool = require("../experimental/index")

module.exports = {
    compressFile: async function (file) {
        try {
            const result = await pool.exec('compress',[file])
            return result
        } catch (error) {
            console.log(error)
        }
    }
}