const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const internSchema = new Schema({
    pInfo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Register'
    },
    depNo: {
        type: Number,
        required: true,
        unique: true
    },
    bankName: {
        type: String,
        required: true
    },
    bankAc: {
        type: String,
        required: true,
    },
    ifsc: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    repOfficer: {
        type: Schema.Types.ObjectId,
        ref: 'Officer',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Intern', internSchema);
