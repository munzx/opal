'user strict';

angular.module('authModule').controller('signinAuthController', ['registerUserConfigFactory', '$scope', '$http', '$location', '$rootScope', function (registerUserConfigFactory, $scope, $http, $location, $rootScope) {
	$scope.signIn = function () {
		$http.post('/login', $scope.credentials)
		.success(function (data, success) {
			registerUserConfigFactory.setUser(data);
			if($rootScope.lastPage){
				$location.path($rootScope.lastPage);
			} else {
				if(data.role == 'admin'){
					$location.path('/admin');
				} else {
					$location.path('/profile');
				}
			}
		})
		.error(function (data, error) {
			$scope.error = data;
		});
	};
}]);