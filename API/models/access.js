const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginCredSchema = new Schema({
    userDetails: {
        type: Schema.Types.ObjectId,
        ref: 'Intern'
    },
    userName: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    adminAccessGiven: { // for admin
        type: Boolean,
        default: false // this means that the user have the limited access.
    },
    role: {
        type: String,
        default: 'intern',
        required: true,
        enum: ['intern', 'admin']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Access', loginCredSchema);