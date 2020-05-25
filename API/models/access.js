const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginCredSchema = new Schema({
    userDetails: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Intern'
    },
    userName: { 
        // an email is used!
        type: String,
        require: true,
        unique: true
    },
    password: {
        // hash
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
        enum: ['intern', 'admin','officer']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Access', loginCredSchema);