var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var relationSchema = new Schema({
	id: Number,
	firstName : String,
	lastName : String, 
	title : String,
	manager : Number,
	reportTo : Array,
	imgPath : String,
	managerName : String,
	nameOfReportTo : Array
},

{ 
	collection : 'employeeRelation' 
});

module.exports = mongoose.model('employeeRelation', relationSchema);