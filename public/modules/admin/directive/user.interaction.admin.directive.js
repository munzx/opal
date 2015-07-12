'user strict';

angular.module('adminModule').directive('userInteractionAdminDirective', ['connectAdminFactory', function (connectAdminFactory) {
	return {
		require: '?ngModel',
		restrict: 'A',
		templateUrl: '/public/modules/admin/view/user.interaction.admin.directive.view.html',
		replace: true,
		link: function (scope, elem, attrs, ngModel) {
			connectAdminFactory.get({page: 'analysis', action: 'indepthanalysis'}, function (response) {
				scope.pieLabels = ["User has order", "User has product", "User has cart", "User has comment", "User has heart", "User with no product or order"];
				scope.pieData = [response.hasOrderCount, response.hasProductCount, response.userHasCartCount, response.userHasCommentCount, response.userHasHeartCount, response.hasNoProductOrOrderCount];
			});
		}
	}
}]);