var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	id: Number,
	firstName : String,
	lastName : String, 
	startDate : String, 
	officePhone : String, 
	cellPhone : String, 
	email : String,
	sex : String,
	title : String,
	managerid : Number,
	imgPath : String
},

{ 
	collection : 'employee' 
});

module.exports = mongoose.model('employee', userSchema);