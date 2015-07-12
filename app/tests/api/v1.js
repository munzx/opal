'use strict';

var expect = require('expect.js'),
superagent = require('superagent'),
mongoose = require('mongoose'),
product = require('../../models/product');

//test variables
var agent = superagent.agent();

describe("test access", function() {
	before(function(done){
		agent.post('http://localhost:3000/login')
		.send({ username: 'moe', password: '12345qwert'})
		.end(function(err, res){
			if(err){
				throw err;
			} else {
				agent.saveCookies(res);
			}
			done();
		});
	});
	it("Should pass the user auth", function(done) {
		agent.get('http://localhost:3000/check')
		.end(function(err, res){
			expect(res.status).to.be(200);
			expect(res.body).to.be('logged i');
			done();
		});
	});
	it("should update the user info", function() {
		agent.put()
	});
});