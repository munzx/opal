'use strict';

angular.module('authModule').factory('connectAuthFactory', ['$resource', function ($resource) {
		return $resource('/api/v1/user/:id');
}]);