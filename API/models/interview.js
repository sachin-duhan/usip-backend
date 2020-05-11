const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interviewSchema = new Schema({
    pInfo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Register'
    },
    interview: {
        type: Boolean,
        default: false
    },
    interview_attendence: {
        type: Boolean,
        default: false
    },
    interview_marks: {
        type: Number,
        default: 0
    },
    interview_comment: {
        type: String,
        default: 'none'
    },
    interview_date: Date,
    slot_details: String, // interview are conducted in slot and details can be writter here!!
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Intern', interviewSchema);