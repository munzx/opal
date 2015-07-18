'use strict';

angular.module('productModule').controller('indexProductController', ['$scope', 'connectAdminFactory', '$http', 'limitToFilter', function ($scope, connectAdminFactory, $http, limitToFilter) {
	$scope.getInks = function(pageNo){
		var skipVal = (pageNo == 0 || pageNo == 1)? 0: 40*(pageNo - 1);
		connectAdminFactory.get({page: 'product', action: 'ink', limit: 40, skip: skipVal}, function(response){
			$scope.bigTotalItems = Math.ceil(response.total / 40);
			$scope.products = response.result;
		});
	}

	$scope.maxSize = 5;
	$scope.bigCurrentPage = 1;

	//initiate first call
	$scope.getInks(0);

	$scope.uploadProductFile = function(){
		var formData = new FormData();
		var file = document.getElementById('productFile').files[0];
		formData.append('file', file);

		$scope.error = false;

		$http.post('/api/v1/admin/product/upload', formData, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(function(data, success){
			$scope.products = data;
		})
		.error(function(data, error){
			$scope.error = data;
		});
	}

	$scope.totalItems = 40;

	$scope.setPage = function (pageNo) {
		$scope.bigCurrentPage = pageNo;
	};

	$scope.pageChanged = function() {
		$scope.getInks($scope.bigCurrentPage);
	};

	$scope.getModels = function(val) {
		return $http.get('/api/v1/admin/product/search/' + val).then(function(response){
			return limitToFilter(response.data, 15);
		});
	};

	$scope.test = function(){
		if($scope.asyncSelected.length == 0){
			$scope.getInks(0);
		}
	}

	 $scope.onSelect = function ($item, $model, $label) {
	 	$scope.products = [$item];
	};


}]);