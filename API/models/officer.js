const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const intern = new Schema({
    name:{type:String}
});

const officerSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    deptt:{
        type:String,
        required:true
    },
    interns:[intern]
});

module.exports = mongoose.model('Officer',officerSchema);