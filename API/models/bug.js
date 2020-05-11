const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bugSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pInfo: {
        type: Schema.Types.ObjectId,
        ref: 'Intern',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isResolved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Bugs', bugSchema);