'use strict';

angular.module('adminModule').directive('lineChartAdminDirective', ['$q', '$modal', 'connectAdminFactory', function ($q, $modal, connectAdminFactory) {
	 return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/linechart/linechart.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			function getLineChartAnalysis (dateFrom) {
				$q.all([
					connectAdminFactory.get({page: 'analysis', action: 'products', param: dateFrom}).$promise,
					connectAdminFactory.get({page: 'analysis', action: 'comments', param: dateFrom}).$promise,
					connectAdminFactory.get({page: 'analysis', action: 'hearts', param: dateFrom}).$promise,
					connectAdminFactory.get({page: 'analysis', action: 'orders', param: dateFrom}).$promise,
					connectAdminFactory.get({page: 'analysis', action: 'carts', param: dateFrom}).$promise,
					connectAdminFactory.get({page: 'analysis', action: 'users', param: dateFrom}).$promise
				]).then(function (result) {
					scope.lineData = [
						result[0].dataPoints,
						result[1].dataPoints,
						result[2].dataPoints,
						result[3].dataPoints,
						result[4].dataPoints,
						result[5].dataPoints
					]

					scope.data = [
						result[0].data,
						result[1].data,
						result[2].data,
						result[3].data,
						result[4].data,
						result[5].data
					]

					scope.lineLabels = result[0].fullDate;
					scope.dateFrom = new Date(scope.lineLabels[0]);
				}, function (err) {
					console.log(err);
				});

				scope.lineLabels = ["January", "February", "March", "April", "May", "June", "July"];
				scope.lineSeries = ['Products', 'Comments', 'Hearts', 'Orders', 'Carts', 'Users'];
				scope.lineData = [
					[],
					[],
					[],
					[],
					[],
					[]
				];
			}

			scope.getPointInfo = function (points, evt) {
				var pointer = scope.lineLabels.indexOf(points[0].label);
				scope.pointerInfo = {
					'date': points[0].label,
					'Products': scope.data[0][pointer],
					'ProductsColor': points[0].strokeColor,
					'Comments': scope.data[1][pointer],
					'CommentsColor': points[1].strokeColor,
					'Hearts': scope.data[2][pointer],
					'HeartsColor': points[2].strokeColor,
					'Orders': scope.data[3][pointer],
					'OrdersColor': points[3].strokeColor,
					'Carts': scope.data[4][pointer],
					'CartsColor': points[4].strokeColor,
					'Users': scope.data[5][pointer],
					'UsersColor': points[5].strokeColor
				}
			}

			scope.showProducts = function (point) {
				$modal.open({
					templateUrl: '/public/modules/admin/view/linechart/products.linechart.admin.directive.view.html',
					size: 'lg',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.info = scope.pointerInfo.Products;
					}]
				});	
			}
			scope.showComments = function (point) {
				$modal.open({
					templateUrl: '/public/modules/admin/view/linechart/comments.linechart.admin.directive.view.html',
					size: 'lg',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.info = scope.pointerInfo.Comments;
					}]
				});	
			}
			scope.showHearts = function (point) {
				$modal.open({
					templateUrl: '/public/modules/admin/view/linechart/hearts.linechart.admin.directive.view.html',
					size: 'lg',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.info = scope.pointerInfo.Hearts;
					}]
				});	
			}
			scope.showOrders = function (point) {
				$modal.open({
					templateUrl: '/public/modules/admin/view/linechart/orders.linechart.admin.directive.view.html',
					size: 'md',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.info = scope.pointerInfo.Orders;
						console.log($scope.info);
					}]
				});	
			}
			scope.showCarts = function (point) {
				$modal.open({
					templateUrl: '/public/modules/admin/view/linechart/carts.linechart.admin.directive.view.html',
					size: 'md',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.info = scope.pointerInfo.Carts;
					}]
				});	
			}
			scope.showUsers = function (point) {
				$modal.open({
					templateUrl: '/public/modules/admin/view/linechart/users.linechart.admin.directive.view.html',
					size: 'sm',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.info = scope.pointerInfo.Users;
					}]
				});	
			}

			//initilize the line chart
			getLineChartAnalysis();

			scope.getAnalysisButtton = function () {
				getLineChartAnalysis(scope.dateFrom);
			}
		}
	}
}]);