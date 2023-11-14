const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaults = new Schema({
    defaults: {
        type: Object,
        required: true
    },
    name: {
        type: String,
        unique: [true, 'This name is already taken'],
    }
},{
    timestamps: true
});



module.exports = mongoose.model('Defaults', defaults);
