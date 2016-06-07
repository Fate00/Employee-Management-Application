var app = angular.module("myapp", ['ngRoute', 'flow', 'infinite-scroll']);

console.log('App init..');

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        	.when('/', {
        		templateUrl: 'employeeList.html',
                controller: 'listController'
        	})
            .when('/createRoute', {
                templateUrl: 'createEmployee.html',
                controller: 'createEmpController'
            })
            .when('/edit/:userId', {
                templateUrl: 'employeeEdit.html',
                controller: 'editUserController'
            })
            .otherwise({
                redirectTo: '/'
            })
            .when('/getdetails/:userId', {
            	templateUrl: 'employeeDetail.html',
            	controller: 'userDetailController'
            });
    }
]);

app.factory('listService', function($http) {
	
	console.log('factory init..');

	return {

		getList: function($scope, callback) {
			
			$http({
				method: 'GET',
				url: '/getlist'					
			}).then(function(res) {
				console.log("coming from expressjs ", res);
				var users = res.data;

				var arr = [];
				for (var i = 0; i < users.length; i++) {
					arr[i] = users[i].id;
				}
				// arr.sort();

				console.log('arr length:' + arr.length);
				console.log(arr);

				$scope.maxid = Math.max.apply(null, arr);
			
				console.log("maxid: " + $scope.maxid);
				
		
				callback(users);
			});
    	},

		uploadImg: function(img, $scope) {

			console.log("Img info: ");

			var maxid = Number($scope.maxid) + 1;
			var fd = new FormData();

			fd.append('img', img.file);
			// alert(img);

			$http({
				method: 'POST',
				url: '/upload/' + maxid,
				data: fd,
				headers: {
		            'Content-Type': undefined,
		            transformRequest: angular.identity
		        }					
			}).then(function(res) {
				// alert(res.data);
				console.log(res.data);					
				
			});
		},

		changeImg: function(img, $scope) {
			var fd = new FormData();

			fd.append('img', img.file);
			// alert(img);

			$http({
				method: 'POST',
				url: '/upload/' + $scope.editId,
				data: fd,
				headers: {
		            'Content-Type': undefined,
		            transformRequest: angular.identity
		        }					
			}).then(function(res) {
				// alert(res.data);
				console.log(res.data);					
			});
		},

		addEmployee: function($scope) {

			var managerId;
			if( $scope.manager == '-1'){
				managerId = -1;
			} else {
				managerId = $scope.manager;
			}

			var newEmpolyee = {
						id : Number($scope.maxid) + 1,
						firstName : $scope.firstName,
						lastName : $scope.lastName, 
						startDate : $scope.startDate, 
						officePhone : '+1' + $scope.officePhone, 
						cellPhone : '+1' + $scope.cellPhone, 
						email : $scope.email,
						sex : $scope.sex,
						title : $scope.title,
						managerid : managerId
					};

			$http
			.post('/employee', newEmpolyee)
			.success(function(response) {
				console.log("coming from expressjs ", response);
            });
		},

		getUserById: function(userId, $scope, callback) {
			$http({
				method: 'GET',
				url: '/getUserById/' + userId,										
			}).then(function(res) {
				// alert(res.data);
				var tmp = res.data;
				$scope.uid = tmp[0].id;					
				$scope.firstName = tmp[0].firstName;
				$scope.lastName = tmp[0].lastName;
				$scope.startDate = tmp[0].startDate;
				$scope.officePhone = tmp[0].officePhone;
				$scope.cellPhone = tmp[0].cellPhone;
				$scope.email = tmp[0].email;
				$scope.sex = tmp[0].sex;
				$scope.title = tmp[0].title;
				$scope.imgPath = tmp[0].imgPath;
				$scope.originalManagerId = tmp[0].managerid;
				callback();
			});
		},

		getManagerList: function(userId, $scope) {

			$http({
				method: 'GET',
				url: '/getManagerList'
			}).then(function(res) {
				var tmp = res.data;
				for (var i = 0; i < tmp.length; i++) {
					if (tmp[i].id == userId) {
						tmp.splice(i, 1);
						break;
					}
				}
				$scope.managerList = tmp;
			});
		},

		editUser: function($scope, callback) {

			var employee = {
						firstName : $scope.firstName,
						lastName : $scope.lastName, 
						startDate : $scope.startDate, 
						officePhone : '+1' + $scope.officePhone, 
						cellPhone : '+1' + $scope.cellPhone, 
						email : $scope.email,
						sex : $scope.sex,
						title : $scope.title,
						managerid : $scope.manager
					};

			$http({
				method: 'POST',
				data: employee,
				url: '/editUser/' + $scope.editId
			}).then(function(res) {
				console.log(res.data);
				callback();
			});
		},

		getManagerById: function(managerid, callback) {
			$http({
				method: 'GET',
				url: '/getUserById/' + managerid
			}).then(function(res) {
				callback(res.data);
			});
		},

		getNumOfReportById: function(userId, callback) {
			$http({
				method: 'GET',
				url: '/getNumOfReportById/' + userId
			}).then(function(res) {
				callback(res.data);
			});
		},

		deleteUser: function(id, callback) {
			$http({
				method: 'DELETE',
				url: '/deleteUser/' + id
			}).then(function(res) {
				console.log(res.data);
				callback();
			});
		}, 

		getDetailReport: function(userId, callback) {
			$http({
				method: 'GET',
				url: '/getDetailReport/' + userId
			}).then(function(res) {
				console.log("*************");
				console.log(res.data);
				callback(res.data);
			});
		},

		getManager: function(userId, callback) {
			$http({
				method: 'GET',
				url: '/getManager/' + userId
			}).then(function(res) {
				callback(res.data);
			});
		}
	};
});

app.controller('listController', function($scope, $routeParams, listService, $location, $route) {

	$scope.docs = [];

	listService.getList($scope, function(users) {
		
		$scope.allUsers = users;
		$scope.busy = false;
		$scope.index = 3;
		$scope.constant = 2;
		$scope.users = users.slice(0, 3);		
		// $location.path('/');
	});
	
    $scope.loadMore = function () {
        if ($scope.busy)
        	return;
        $scope.busy = true;
        if ($scope.index >= $scope.allUsers.length) {
        	$scope.busy = true;
        } else if (($scope.index < $scope.allUsers.length) && ($scope.index + $scope.constant >= $scope.allUsers.length)) {
        	var tmp1 = $scope.allUsers.slice($scope.index);
        	for (var i = 0; i < tmp1.length; i++) {
        		$scope.users.push(tmp1[i]);
        	}
        	$scope.busy = true;
        } else {
        	var tmp2 = $scope.allUsers.slice($scope.index, $scope.constant + $scope.index);
        	for (var i = 0; i < tmp2.length; i++) {
        		$scope.users.push(tmp2[i]);	
        	}
        	$scope.index = $scope.index + $scope.constant;
        	$scope.busy = false;
        }
    }

    $scope.sort = function(keyName) {
    	$scope.sortKey = keyName;
    	$scope.reverse = !$scope.reverse;
    }

    $scope.deleteUser = function(id) {
		
		listService.deleteUser(id, function() {
			listService.getList($scope, function(users) {	
				console.log("*************");
				console.log(users);				
				$scope.users = users;
				$location.path('/');
			});
		});	
	}

	$scope.homePage = function() {
		$route.reload();
	}

	$scope.getDetailReport = function(userId) {
		listService.getDetailReport(userId, function(users) {
			$scope.users = users;				
		});
	}

	$scope.getManager = function(userId) {
		listService.getManager(userId, function(users) {
			$scope.users = users;
		});
	}

});

app.directive('typeAhead', function($http) {
	var obj = {
		restrict: 'AE',
		scope: {
			docs : '='
		},
		link: function(scope, element) {
			element.on('keyup', function() {
				var val = element.val();
				$http({
					method: 'GET',
					url: '/dirGet/' + val
				}).then(function(res) {
					scope.docs = res.data;
				});
			});
		}
	}
	return obj;
});

app.directive('mouseEffect', function() {
	var obj = {
		restrict: 'AE',
		link: function(scope, element, attrs) {
			element.bind('mouseenter', function() {
				element.css({ 'background-color' : '#DFDBDB' });
			});

			element.bind('mouseleave', function() {
				element.css({ 'background-color' : '#FFFFFF' });
			});
		}
	}
	return obj;
});

app.controller('createEmpController', function($scope, $location, listService) {

	listService.getList($scope, function(users) {
		$scope.users = users;
	});

    $scope.createEmployee = function(e) {
    	listService.uploadImg(e, $scope);
    	listService.addEmployee($scope);
    	$location.path('/index.html');
    };

});

app.controller('userDetailController', function($scope, $location, $routeParams, listService) {
	listService.getUserById($routeParams.userId, $scope, function() {
		listService.getManagerById($scope.originalManagerId, function(manager) {
			$scope.managerName = manager[0].firstName + ' ' + manager[0].lastName;
		});
	});
});

app.controller('editUserController', function($scope, $location, $routeParams, listService) {

	$scope.editId = $routeParams.userId;
	listService.getUserById($routeParams.userId, $scope, function() {
		listService.getManagerList($routeParams.userId, $scope);	
	});
	

	$scope.editEmployee = function(e) {

		if (e.length > 0) {
			listService.changeImg(e[0], $scope);
		}

		listService.editUser($scope, function() {
			$location.path('/');
		});

	}
});

app.filter('offset', function() {
	return function(input, start) {

		return input.slice(start);
	};
});

function limitPresentImage(ImgD){    
    var areaWidth = 200;    
    var areaHeight = 200;   
    var image=new Image();    
    image.src=ImgD.src;    
    if(image.width>0 && image.height>0){       
        if(image.width/image.height>= areaWidth/areaHeight){    
            if(image.width>areaWidth){    
                ImgD.width=areaWidth;    
                ImgD.height=(image.height*areaWidth)/image.width;    
            }else{    
                ImgD.width=image.width;    
                ImgD.height=image.height;    
            }    
            ImgD.alt=image.width+"×"+image.height;    
        }else{    
            if(image.height>areaHeight){    
                ImgD.height=areaHeight;    
                ImgD.width=(image.width*areaHeight)/image.height;    
            }else{    
                ImgD.width=image.width;    
                ImgD.height=image.height;    
            }    
            ImgD.alt=image.width+"×"+image.height;    
        }    
    }    
}

function limitDetailImage(ImgD){    
    var areaWidth = 360;    
    var areaHeight = 210;   
    var image=new Image();    
    image.src=ImgD.src;    
    if(image.width>0 && image.height>0){       
        if(image.width/image.height>= areaWidth/areaHeight){    
            if(image.width>areaWidth){    
                ImgD.width=areaWidth;    
                ImgD.height=(image.height*areaWidth)/image.width;    
            }else{    
                ImgD.width=image.width;    
                ImgD.height=image.height;    
            }    
            ImgD.alt=image.width+"×"+image.height;    
        }else{    
            if(image.height>areaHeight){    
                ImgD.height=areaHeight;    
                ImgD.width=(image.width*areaHeight)/image.height;    
            }else{    
                ImgD.width=image.width;    
                ImgD.height=image.height;    
            }    
            ImgD.alt=image.width+"×"+image.height;    
        }    
    }    
}