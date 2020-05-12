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
    marks: Number,
    rollNo: {
        type: String,
        unique: [true, 'Roll number should be unique'],
    },
    branch: String,
    date: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: Number,
        unique: [true, "phone number must be unique"],
        minlength: 10
    },
    domain: {
        type: [String]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isQualified: {
        type: Boolean,
        default: false
    },
    exp: String // details of experience that applicant thinks he have!!
});


module.exports = mongoose.model('Register', registerSchema);