const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const officerSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    officer: {
        type: Schema.Types.ObjectId,
        ref: 'Officer',
        required: true
    },
    role: {
        type: String,
        default: 'officer'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Officer_login', officerSchema);