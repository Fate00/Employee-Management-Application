angular.module('customServices', ['flow'])
	.factory('listService', function($http) {
		
		console.log('factory init..');
		var tmpUsers = [];

		var usersPerPage = 5;
		var currentPage = 0;
		var showPrevPage = false;
		var showNextPage;
		var baseUrl = '/api/oprtUsers';

		return {

			uploadImg: function(img, $scope) {
				var maxid = Number($scope.maxid) + 1;
				var fd = new FormData();

				fd.append('img', img.file);

				$http
				.post('/upload/'+maxid, fd, 
					{
						transformRequest: angular.identity,
						headers: { 'Content-Type': undefined }
					}
				)
				.success(function(){
					console.log("upload image to server: ", response);
				})
				.error(function(){
				});
			},

			addEmployee: function($scope) {

				var managerId;
				if( $scope.manager == '-1'){
					managerId = null;
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

			getList: function($scope) {
				
				$http
				.get('/getlist')
				.success(function(response) {
					console.log("coming from expressjs ", response);
					$scope.users = response;
					$scope.maxid = $scope.users[$scope.users.length - 1].id;
	            });
        	}

		};
	});
	