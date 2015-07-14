'use strict';

// Depnedencies
var mongoose = require('mongoose'),
errorHandler = require('./error'),
lookup = require('country-data').lookup,
fs = require('fs'),
async = require("async"),
_ = require('lodash'),
users = require('../models/user'),
category = require('../models/category'),
accounts = require('../models/account'),
contacts = require('../models/contact'),
moment = require('moment'),
lineChart = require('../helpers/lineChart'),
dateInput = require('../helpers/dateInput'),
isValidParentCategory = require('../helpers/isValidParentCategory');

module.exports.createFirst = function (req, res) {
	users.find({role: 'admin'}, {password: 0}, function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user.length > 0){
			res.status(200).jsonp('Admin Exists');
		} else {
			var countryInfo = lookup.countries({name: 'United Arab Emirates'})[0];
			var country = [{
				name: countryInfo.name,
				code: countryInfo.alpha2,
				callingCode: countryInfo.countryCallingCodes[0],
				currency: countryInfo.currencies[0],
				language: countryInfo.languages[0]
			}];

			var newUser = new users({
				firstName: 'munzir',
				lastName: 'suliman',
				name: 'moeAdmin',
				role: 'admin',
				email: 'munzir.suliman@outlook.com',
				password: 'Dubai@123',
				country: country
			});

			newUser.save(function(err, user){
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					res.status(200).jsonp(user);
				}
			});
		}
	});
}


module.exports.index = function (req, res) {
	users.find({role: 'admin'}, {password: 0}, function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(user);
		}
	});
}

module.exports.users = function (req, res) {
	var limit = 0,
	skip = 0;

	if(req.params.limit){
		limit = req.params.limit;
	}

	if(req.params.skip){
		skip = req.params.skip;
	}

	users.find({'role': 'user'}, {password: 0}, {limit: req.params.limit, skip: req.params.skip}).sort({created: -1}).exec(function (err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp({'users': user, count: user.length});
		} else {
			res.status(404).jsonp({message: 'No user has been found'});
		}
	});
}

module.exports.messages = function (req, res) {
	contacts.find({}).sort({date: -1}).exec(function (err, contact) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(contact){
			res.status(200).jsonp({'messages': contact, 'count': contact.length});
		} else {
			res.status(404).jsonp({message: 'No message has been found'});
		}
	});
}



module.exports.category = function (req, res) {
	category.find({}, function (err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(result);
		}
	});
}

module.exports.addCategory = function (req, res) {
	var newCatName = req.body.category.name;
	var catParentName = req.body.category.parent;

	category.find({}, function(err, result){
		if(err){
			res.status(500).jsonp({message: err});
		} else {
			isValidParentCategory(result, newCatName, catParentName, function(err, check){
				if(err){
					res.status(500).jsonp({message: err});
				} else {
					var newCategory = new category(req.body.category);
					newCategory.save(function (err, result) {
						if(err){
							res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
						} else {

							res.status(200).jsonp(result);
						}
					});
				}
			});
		}
	});
}

module.exports.updateCategory = function (req, res) {
	if(req.body.category){
		//make sure that update names of category and it parents does not match
		if(req.body.category.name != req.body.category.parent){
			category.find({}, function (err, result) {
				if(err){
					res.status(500).jsonp({message: err});
				} else {
					var newCatName = req.body.category.name;
					var catParentName = req.body.category.parent;
					//check is this a valid category
					isValidParentCategory(result, newCatName, catParentName, function(err, check){
						if(err){
							res.status(500).jsonp({message: err});
						} else {
							//get the category id
							var catId = _.findIndex(result,  function(item){
								return item._id == req.params.id;
							});
							//save the old category info
							var oldValue = JSON.parse(JSON.stringify(result[catId]));
							//add data to the category (user input)
							var cat = _.extend(result[catId], req.body.category);

							cat.save(function(err, newCategory){
								if(err){
									res.status(500).jsonp({message: err});
								} else {
									//update the category parent name in the whole DB
									console.log(result[catId].name);
									console.log(oldValue.name);
									category.update({parent: oldValue.name}, {parent: result[catId].name}, {multi: true},function(err, updateResult){
										if(err){
											res.status(500).jsonp({message: err});
										} else {
											res.status(200).jsonp(newCategory);
										}
									});	
								}
							});
						}
					});
				}
			});
		} else {
			res.status(500).jsonp({message: 'Parent category can not include itself'});
		}
	} else {
		res.status(500).jsonp({message: 'No information has been provided'});
	}
}

module.exports.removeCategory = function (req, res) {
	category.find({_id: req.params.id}).remove().exec(function (err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp('Category has been removed successfully');
		}
	});
}

module.exports.uploadProductsFile = function (req, res){
	console.log(req.body);
	console.log(req.files);
	res.status(200).jsonp('Bism Allah, here is the uploaded file');
}