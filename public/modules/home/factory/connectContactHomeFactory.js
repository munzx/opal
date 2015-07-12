'user strict';

angular.module('expressx').factory('connectContactHomeFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/cms/contact');
}]);