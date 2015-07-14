'use strict';

angular.module('adminModule').controller('indexAdminController', ['$scope', 'registerUserConfigFactory', '$location', function ($scope, registerUserConfigFactory, $location) {
	$scope.user = registerUserConfigFactory.getUser();

	//if the admin is not signed in then redirect to the sign page
	if($scope.user === false) $location.path('/signin');

}]);