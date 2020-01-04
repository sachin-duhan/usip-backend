const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Model for application
const reportSchema = new Schema({
    intern: {
        type: Schema.Types.ObjectId,
        ref:'Intern',
        required:true
    },
    reportImage:{ // this will store the URL of the image being uploaded
        type:String,
        required:true
    },
    start:{
        type:Date,
        required:true
    },
    end:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    stipendGiven:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);