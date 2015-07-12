'use strict';

angular.module('adminModule').factory('connectAdminFactory', ['$resource', function ($resource) {
	return $resource('api/v1/admin/:page/:action/:id/:param/:limit/:skip', 
		{
			"page": "@page",
			"action": "@action",
			"param": "@param",
			"limit": "@limit",
			"skip": "@skip"
		}, 
		{ 
		'update': { method:'PUT' }
	});
}]);