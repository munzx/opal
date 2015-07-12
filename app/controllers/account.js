'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./error'),
	accounts = require('../models/account'),
	lookup = require('country-data').lookup,
	users = require('../models/user'),
	ObjectID = mongoose.Types.ObjectId;

module.exports.getById = function (req, res) {
	accounts.findOne({'_id': ObjectID(req.params.id)}, {'accessToken': 0}).populate('user').exec(function (err, account) {
		if(err){
			res.status(500).jsonp('err');
		} else if(account){
			res.status(200).jsonp(account);
		} else {
			res.status(404).jsonp('Account has not been found');
		}
	});
}

//Complete the needed information when a user login in through
//a third party provider "social media platform like facebook"
module.exports.completeProviderProfile = function (req, res) {
	//provide
	//providerUserId
	accounts.findOne({_id: ObjectID(req.params.id)}).populate('user').exec(function (err, account) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(account){
			if(account.user.length > 0){
				res.status(401).jsonp({message: 'User already exists'});
			} else {
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
						account.user.push(user);
						account.save();
						res.status(200).jsonp(user);
					}
				});
			}
		} else {
			res.status(500).jsonp({message: 'Account has not been found'});
		}
	});
}


module.exports.linkProviderAccount = function (req, res) {
	console.log('trying to link instagram');
	accounts.findById(req.params.id).populate('user').exec(function (err, account) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(account){
			if(account.user.length > 0){
				res.status(401).jsonp({message: 'Account already exists'});
			} else {
				account.user = req.user;
				account.save(function (err) {
					if(err){
						res.redirect('/');
					} else {
						res.redirect('/');
					}
				});
			}
		} else {
			res.status(404).jsonp({message: 'Account has not been found'});
		}
	});
}

module.exports.AccountsStatus = function (req, res) {
	accounts.find({}, {'provider': 1}).where({"user": req.params.userID}).populate('user').exec(function (err, account) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(account){
			res.status(200).jsonp({status: account});
		} else {
			res.status(404).jsonp({message: 'Account has not been found'});
		}
	});
}