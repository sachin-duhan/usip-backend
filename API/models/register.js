const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    application_title: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'Date'
    },
    collegeName: {
        type: String,
        default: 'Delhi Technological University'
    },
    marks: {
        type: Number,
        // required: true
    },
    rollNo: {
        type: String,
        // required: true,
        unique: [true, 'Roll number should be unique'],
        maxlength: 13
    },
    branch: {
        type: String,
        // required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: Number,
        // required: true,
        unique: true,
        minlength: 10
    },
    domain: {
        type: [String]
    },
    isSelected: {
        type: Boolean,
        // required: true,
        default: false
    },
    exp: {
        type: String,
        // required: true
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
    }
});

module.exports = mongoose.model('Register', registerSchema);