'use strict';

var _ = require('lodash');

module.exports = function isValidParentCategory(cats, newCatName, parent, callback){
	//if the parent name and the category name is the asame return false
	if(newCatName == parent) return callback('Parent category can not contain itself');

	var startParent = parent;
	var parents = [];
	var parentInfo;

	while(true){
		//find the category
		parentInfo = _.find(cats, function(item){
			return item.name == startParent;
		});
		//find the category parent info 
		if(parentInfo != undefined){
			//add parent name to array
			parents.push(parentInfo.name);
			//if parent is root then break the loop
			if(parents.indexOf('root') != -1){ break };
			//make the parent name the starting name to finding next category (going up the tree)
			startParent = parentInfo.parent;
		} else {
			break;
		}
	}

	//add the new category name to the parents array
	parents.push(newCatName);
	//remove any duplications in the parents array and add result to "check" array
	var check = _.intersection(parents);
	//if check array and parents array are in same length then return true
	if(check.length == parents.length) return callback(null, true);
	//if not then return error
	return callback('Category can not contain itself');
}