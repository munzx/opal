'user strict';

angular.module('authModule').controller('signoutAuthController', ['registerUserConfigFactory', '$http', '$state', function (registerUserConfigFactory, $http, $state) {
	$http.get('logout')
	.success(function (data, success) {
		registerUserConfigFactory.clearUserInfo();
		$state.go('home', {}, {reload: true});
	});
}]);