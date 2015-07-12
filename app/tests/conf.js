'use strict';

var mongoose = require('mongoose');
var user = require('../models/user');
var superagent = require('superagent');

before(function(done){
	//Connect to mongoDB
	mongoose.connect('mongodb://localhost/test');
	done();
});


after(function(done){
	//user.remove().exec();
	mongoose.connection.close();
	done();
});