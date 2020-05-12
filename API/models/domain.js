const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const domainSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: [true, 'Domain should be unique']
    }
});
module.exports = mongoose.model('Domain', domainSchema);