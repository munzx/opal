'use strict';

angular.module('expressx').factory('registerUserConfigFactory', ['$window', '$rootScope', '$q', function ($window, $rootScope, $q) {
	//Get the user info from the window element that has been injected in the index page on the server side
	var _this = {};

	//user info
	_this.user = false;

	//Read user info
	_this.readUserInfo = function () {
		return _this.user = $window.userInfo || false;
	};

	//Clear user info from the browser and change the rootScope status to false
	_this.clearUserInfo = function () {
		//var element = document.getElementById("userInfoBlock"); //this code dose not seem to work!
		//if(element) element.parentNode.removeChild(element); //this code dose not seem to work!
		$rootScope.logged = false;
		$rootScope.lastPage = '';
		_this.user = $window.userInfo = false;
	};

	//register user info
	_this.setUser = function (user) {
		_this.user = $window.userInfo = user || false;
		if(_this.user){
			$rootScope.logged = true;
		};
	};

	//Get the user info
	_this.getUser = function () {
		var deferred = $q.defer();
		deferred.resolve(_this.readUserInfo());
		deferred.promise.then(function (result) {
		 	if(result){
		 		_this.user = result;
		 		$rootScope.logged = true;
		 	};
		});
		return _this.user;
	};

	return _this;
}]);