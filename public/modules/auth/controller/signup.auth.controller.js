'user strict';

angular.module('authModule').controller('signupAuthController', ['registerUserConfigFactory', '$scope', '$location', 'connectAuthFactory', 'countryListConfigFactory', function (registerUserConfigFactory, $scope, $location, connectAuthFactory, countryListConfigFactory) {
	if(registerUserConfigFactory.getUser()) $location.path('/profile');
	$scope.countryList = countryListConfigFactory;

	$scope.signUp = function () {
		connectAuthFactory.save($scope.credentials, function (data, res) {
			$location.path('/signin');
		},
		function (err) {
			$scope.error = err.data.message;
		});
	}

}]);