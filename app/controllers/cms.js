'use strict';

var mongoose = require('mongoose'),
	_ = require('lodash'),
	errorHandler = require('./error'),
	email = require('../config/email/config.email.js'),
	contacts = require('../models/contact');

module.exports.contactIndex = function (req, res) {
	
}

module.exports.contact = function (req, res) {
	var contact = new contacts(req.body);

	contact.save(function (err, newContact) {
		if(err){
			//send me and email
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			email.sendEmail(['munzir.suliman@outlook.com']);
			res.status(200).jsonp('Contact has been sent successfully');
		}
	});
}