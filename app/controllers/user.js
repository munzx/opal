'use strict';

// Depnedencies
var mongoose = require('mongoose'),
errorHandler = require('./error'),
lookup = require('country-data').lookup,
fs = require('fs'),
async = require("async"),
_ = require('lodash'),
users = require('../models/user'),
accounts = require('../models/account');

// get all users
module.exports.index = function (req, res){
	users.find({role: 'user'}, {password: 0}, function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user.length > 0){
			res.status(200).jsonp(user);
		} else {
			res.status(404).json({message: 'No user has been found'});
		}
	});
}

// create a new user
module.exports.create = function(req, res){
	var countryInfo = lookup.countries({name: req.body.country})[0];
	 req.body.country = [{
		name: countryInfo.name,
		code: countryInfo.alpha2,
		callingCode: countryInfo.countryCallingCodes[0],
		currency: countryInfo.currencies[0],
		language: countryInfo.languages[0]
	}];

	var newUser = new users(req.body);

	newUser.save(function(err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(user);
		}
	});
}

// get user by name
module.exports.getByName = function (req, res){
	users.findOne({role: 'user', name: req.params.name}, {password: 0}, function(err, user) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			res.status(200).jsonp(user);
		} else {
			res.status(404).json({message: 'User has not been found'});
		}
	});
}

//update user by id
module.exports.update = function(req, res){
	//form data the user has sent
	var formData = {};
	formData.firstName = req.body.firstName;
	formData.lastName = req.body.lastName;
	formData.email = req.body.email;
	formData.pageDesc = req.body.pageDesc || '';
	if(req.body.mobilePhone){ formData.mobilePhone = req.body.mobilePhone};

	var base64Data = "",
	dest = 'public/uploads/';

	//remove image files
	function removeImages () {
		if (fs.existsSync(dest + bannerName)) {fs.unlink(dest + bannerName)};
		if (fs.existsSync(dest + logoName)) {fs.unlink(dest + logoName)};
	}

	//A function to give unique name to each image file
	function getNewName (initial) {
		if(!initial){
			initial = 'name';
		}
		return initial + '.' + req.user.name + '.' + Math.floor(new Date() / 1000) + '.jpg'
	}

	//make unique names for image files
	var bannerName = getNewName('banner'),
	logoName = getNewName('logo'),
	//get the images data
	banner = req.body.banner,
	logo = req.body.logo,
	//clean images of unnecessary data in order to make images out of the base64 data recieved
	bannerData = (banner.length > 1000) ?  banner.replace(/^data:image\/\w+;base64,/, ""):false,
	logoData = (logo.length > 1000) ?  logo.replace(/^data:image\/\w+;base64,/, ""):false;

	//write the images data to files
	function saveBanner (callback) {
		if(bannerData){
			fs.writeFile(dest + bannerName, bannerData, 'base64', function(err) {
				if(err){ bannerName = false; return callback(err); } else { formData.banner = bannerName; callback(null); };
			});
		} else {
			callback(null);
		}
	}

	//write the images data to files
	function saveLogo (callback) {
		if(logoData){
			fs.writeFile(dest + logoName, logoData, 'base64', function(err) {
				if(err){ logoName = false; return callback(err); } else { formData.logo = logoName; callback(null); };
			});
		} else {
			callback(null);
		}
	}

	async.parallel([saveBanner, saveLogo], function (err) {
		if(err){
			res.status(400).jsonp({message: 'Unkown error has occured, please try again or contact expressx\'s Support Team'});
		} else {
			users.findOne({_id: req.user._id}, function(err, user){
				if(err){
					removeImages();
					res.status(500).jsonp({message: err});
				} else if(user) {
					user.firstName = formData.firstName;
					user.lastName = formData.lastName;
					user.email = formData.email;
					user.mobilePhone = formData.mobilePhone;
					user.pageDesc = formData.pageDesc;
					user.save();

					if(formData.banner){
						if (fs.existsSync(dest + user.banner)) {fs.unlink(dest + user.banner)};
						user.banner = formData.banner;
					}

					if(formData.logo){
						if (fs.existsSync(dest + user.logo)) {fs.unlink(dest + user.logo)};
						user.logo = formData.logo;
					}

					res.status(200).jsonp(user);
				} else {
					res.status(404).json({message: 'User has not been found'});
				}
			});
		}
	});
}

//update the user password
module.exports.changePassword = function(req, res){
	users.findOne({_id: req.user._id, password: req.body.currentPassword},function(err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user){
			user.password = req.body.newPassword;
			user.save(function (err, userInfo) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					res.status(200).jsonp(user);
				}
			});
		} else {
			res.status(401).json({message: 'Current password is not correct'});
		}
	});
}

//delete user by id
module.exports.delete = function(req, res){
	var dest = 'public/uploads/';
	users.findById(req.user._id, function(err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user) {
			user.remove(function (err) {
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					accounts.find(function (err,account) {
						if(account){
							var allUserAccounts = account;
							allUserAccounts.forEach(function (info) {
								info.remove(function () {});
							});
						}
					});
				}
			});
			res.status(200).json({message: 'User has been deleted successfully'});
		} else {
			res.status(404).json({message: 'User has not been found'});
		}
	});
}