const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*

The tenure of any intern can be managed using this schema! this works as the foundation for the 
any other model like Registeration and Internships. Whenever we open new set of fresh application for
students we have to create a new entry in open-close!!
this also marks that weather USIP is accepting applications or not!!
there are two kind of application that can be controlled via this schema

-> Allow intern to fill Bank details 
-> All Applications for USIP

-> make sure that You never Delete any entry in this collection!!
*/

const periodSchema = new Schema({
    title: { // marks the kind of application we have!!
        type: String,
        required: true,
        enum: ['Allow USIP intern application', 'Allow bank details']
    },
    details: {
        /* description of the application! we can maintain a brief objective or statement 
        that give some idea about the objective of opening the application */
        type: String,
        required: true
    },
    start: {
        type: Date,
        default: Date.now,
    },
    end: {
        type: Date,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('Date', periodSchema);