const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// model for notification : 
const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: { type: String, require: false },
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