const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    fileLocation: {
        type: String,
        default: null
    },
    visiblity: {
        type: Boolean,
        required: true,
        // true for public
        // false for intern
    },
    date: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Notification', notificationSchema);