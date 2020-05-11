const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    intern: {
        type: Schema.Types.ObjectId,
        ref: 'Intern',
        required: true
    },
    reportImage: { // this will store the URL of the image being uploaded
        type: String,
        required: true
    },
    start: { // start date of the period for which report is submitted!
        type: Date,
        required: true
    },
    end: { // end date of the period for which report is submitted
        type: Date,
        required: true
    },
    description: { // 50 words summary 
        type: String,
        required: true
    },
    stipendGiven: { // record of stipend 
        type: Boolean,
        default: false
    },
    date: { // date of submission of the report!!
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);