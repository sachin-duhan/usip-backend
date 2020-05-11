const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const domainSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Domain', domainSchema);