var express = require('express');
var path = require('path');
var employeeModel = require('./model/users');
var employeeRelation = require('./model/employeeRelation')
var http = require('http');
var fs = require('fs');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var app = express();

app.set('port',process.env.PORT||3000);

var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('//Remote mongodb link');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/views')));

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = '//Remote mongodb link';
// var employeeData;

var getManagerById = function(managerId, callback) {
	employeeModel.find(
		{
			id : managerId
		},
		"-_id",
		{
			lean : true
		},
		function(err, user) {
			if (err)
				console.log(err);
			callback(user);
		}
	);
}

var getNumOfReportById = function(userId, callback) {
	employeeModel.count(
		{
			managerid : userId
		},
		function(err, num) {
			if (err) 
				console.log(err);
			callback(num);
		}
	);
}

app.get('/', function(req, res) {
	res.send('To index');
});

app.get('/getLenth', function(req, res) {
	console.log("Enter getLength: ")
	employeeModel.count({}, function (err, count) {
			if (err)
				console.log(err);	
			console.log("count: " + count);	
			// res.json({'count' : count});
			res.send(String(count));
		});
});

app.get('/getlist', function(req, res) {
	employeeModel.find({}, "-_id", {lean: true}, function(err, users) {
		if (err)
			console.log(err);
		
		var newUsers = [];
		var counter = 0;
		users.forEach(function(user) {
			getNumOfReportById(user.id, function(reportTo) {
				user.numOfReportTo = reportTo;
				if (user.managerid == -1) {
					user.managerName = '';
					newUsers.push(user);
					if (counter == users.length - 1) 
						res.json(newUsers);
					counter++;
				} else {
					getManagerById(user.managerid, function(managerJson) {
						if (managerJson.length != 0) {
							user.managerName = managerJson[0].firstName + ' ' + managerJson[0].lastName;								
						} else {
							user.managerName = '';
						}

						newUsers.push(user);
						if (counter == users.length - 1) 
							res.json(newUsers);
						counter++;
					});
				}
			});
		});
	});
});

app.post('/upload/:id',multipartMiddleware, function(req, res) {
	console.log("enter upload img rest api: ");
	// console.log("Request params: " + req.params.id);
	var maxid = req.params.id;
	var image =  req.files.img;

	// console.log("Request info: ");
	// console.log(req.body, req.files);

    var newImageLocation = path.join(__dirname, 'views/img', 'id'+maxid+'.jpg');
    // console.log("new img location: ");
    // console.log(newImageLocation);

    fs.readFile(image.path, function(err, data) {
        fs.writeFile(newImageLocation, data, function(err) {
            res.json(200, {
                src: 'img/' + image.name,
                size: image.size
            });
        });
    });
});

app.post('/employee', function(req, res) {

	console.log("Enter post new employee: ");

	var imgPath = 'img/id'+req.body.id+'.jpg';
	var employee = new employeeModel();

	employee.id = req.body.id;
	employee.firstName = req.body.firstName;
	employee.lastName = req.body.lastName;
	employee.startDate = req.body.startDate;
	employee.officePhone = req.body.officePhone;
	employee.cellPhone = req.body.cellPhone;
	employee.email = req.body.email;
	employee.sex = req.body.sex;
	employee.title = req.body.title;
	employee.managerid = req.body.managerid;
	employee.imgPath = imgPath;

	console.log("employee info: ");
	console.log(employee);

	employee.save(function(err) {
		if (err) {
			console.log(err);
		}
		res.json("Message: Save success");
	});
});

app.get('/getUserById/:userId', function(req, res) {

	employeeModel.find(
		{ id : req.params.userId },
		function(err, user) {
			if (err)
				console.log(err);
			res.json(user);
		}
	);
});

app.get('/getManagerList', function(req, res) {
	employeeModel.find({}, function(err, users) {
		if (err)
			console.log(err);
		res.json(users);
	});
});

app.post('/editUser/:userId', function(req, res) {

	employeeModel.findOneAndUpdate(
		{
			id : req.params.userId
		},
		{
			$set : {
				firstName : req.body.firstName,
				lastName : req.body.lastName, 
				startDate : req.body.startDate, 
				officePhone : req.body.officePhone, 
				cellPhone : req.body.cellPhone, 
				email : req.body.email,
				sex : req.body.sex,
				title : req.body.title,
				managerid : req.body.managerid
			}
		},
		function(err) {
			if (err)
				console.log(err);
			res.json("Message : Update Success");
		}
	);
});

app.delete('/deleteUser/:userId', function(req, res) {
	employeeModel.remove(
		{
			id : req.params.userId
		},
		function(err) {
			if (err) 
				console.log(err);
			res.json("Message : delete success");
		}
	);
});

app.get('/getDetailReport/:userId', function(req, res) {
	employeeModel.find(
		{
			managerid : req.params.userId
		},
		"-_id",
		{
			lean: true
		},
		function(err, users) {
			if (err)
				console.log(err);
			// res.json(users);
			var newUsers = [];
			var counter = 0;
			users.forEach(function(user) {
				getNumOfReportById(user.id, function(reportTo) {
					user.numOfReportTo = reportTo;
					if (user.managerid == -1) {
						user.managerName = '';
						newUsers.push(user);
						if (counter == users.length - 1) 
							res.json(newUsers);
						counter++;
					} else {
						getManagerById(user.managerid, function(managerJson) {
							if (managerJson.length != 0) {
								user.managerName = managerJson[0].firstName + ' ' + managerJson[0].lastName;								
							} else {
								user.managerName = '';
							}

							newUsers.push(user);
							if (counter == users.length - 1) 
								res.json(newUsers);
							counter++;
						});
					}
				});
			});
		}
	);
});

app.get('/getManager/:userId', function(req, res) {
	employeeModel.find(
		{
			id : req.params.userId
		},
		"-_id",
		{
			lean: true
		},
		function(err, users) {
			if (err)
				console.log(err);
			// res.json(users);
			var newUsers = [];
			var counter = 0;
			users.forEach(function(user) {
				getNumOfReportById(user.id, function(reportTo) {
					user.numOfReportTo = reportTo;
					if (user.managerid == -1) {
						user.managerName = '';
						newUsers.push(user);
						if (counter == users.length - 1) 
							res.json(newUsers);
						counter++;
					} else {
						getManagerById(user.managerid, function(managerJson) {
							if (managerJson.length != 0) {
								user.managerName = managerJson[0].firstName + ' ' + managerJson[0].lastName;								
							} else {
								user.managerName = '';
							}

							newUsers.push(user);
							if (counter == users.length - 1) 
								res.json(newUsers);
							counter++;
						});
					}
				});
			});
		}
	);
});

app.get('/dirGet/:str', function(req, res) {
	// console.log('Request come: ');
	employeeModel.find(
		{
			$or: [
				{
					firstName : { $regex: req.params.str, $options: 'i' }
				},
				{
					lastName : { $regex: req.params.str, $options: 'i' }
				}
			]
		}, 
		function(err, data) {
			if (err)
				console.log(err);
			res.json(data);
		}
	);
});

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('Server start, listening on port '+ app.get('port'));
});
