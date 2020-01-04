const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// model for notification : 
const taskSchema = new Schema({
	title:{
		type:String,
		required:true
	},
	pInfo:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Intern'
    },
	date:{
		type:Date,
		default:Date.now
	}
});

module.exports = mongoose.model('Tasks',taskSchema);
