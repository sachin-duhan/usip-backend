const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        // officers may add tasks via portal only!!
        type: String,
        required: true
    },
    description: String,
    created_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Officer'
    },
    pInfo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Intern'
    },
    is_completed: {
        type: Boolean,
        default: false
    },
    visible_to_intern: {
        // this can be used for internal feedback system, that officer may
        type: Boolean,
        default: true
    },
    date: {
        // date of creation
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tasks', taskSchema);