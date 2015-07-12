'user strict';

angular.module('homeModule').controller('indexHomeController', ['registerUserConfigFactory', 'connectContactHomeFactory', '$location', '$scope', function (registerUserConfigFactory, connectContactHomeFactory, $location, $scope) {
	$scope.user = registerUserConfigFactory.getUser();


}]);