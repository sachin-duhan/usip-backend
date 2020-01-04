const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const periodSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    details: { // this is major part that will seperate the applications!
        type: String,
        required: true
    },
    Start: {
        type: Date,
        default: Date.now,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Date', periodSchema);