'use strict';

angular.module('authModule').controller('signInProviderAuthController', ['$scope', '$http', '$location', 'connectAccountAuthFactory', '$stateParams', 'countryListConfigFactory', function ($scope, $http, $location, connectAccountAuthFactory, $stateParams, countryListConfigFactory) {
	$scope.countryList = countryListConfigFactory;

	connectAccountAuthFactory.get({id: $stateParams.id}, function (response) {
		$scope.credentials = response;
	});

	$scope.signUp = function () {
		connectAccountAuthFactory.save({id: $stateParams.id}, $scope.credentials, function (data, res) {
			$location.path('/signin');
		},
		function (err) {
			$scope.error = err.data.message;
		});
	}


}]);