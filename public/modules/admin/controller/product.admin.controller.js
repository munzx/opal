'use srict';

angular.module('adminModule').controller('productAdminController', ['$scope', 'connectAdminFactory', '$state', function ($scope, connectAdminFactory, $state) {
	$scope.uploadProductFile = function(){
		var formData = new FormData();
		formData.append('productFile', document.getElementById('file').files[0]);
		console.log(formData);
		connectAdminFactory.save(formData, {'page': 'product', 'action': 'upload'},function (response) {
			//go to profile page , use the state and pass empty parameter to reload the controller
			//$state.go('admin', {}, {reload: true});
			//$scope.loading = false;
			//console.log('response');
			console.log(formData);
		}, function (err) {
			$scope.loading = false;
			console.log(err);
			$scope.error = err.data.message;
		});
	}
}]);