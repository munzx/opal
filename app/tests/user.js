'use strict';

var expect = require('expect.js'),
	superagent = require('superagent'),
	mongoose = require('mongoose'),
	user = require('../models/user');

var agent = superagent.agent();

describe("useres test", function() {
	before(function(done){
		agent.post('http://localhost:3000/login')
		.send({ username: 'ss', password: 'ss'})
		.end(function(err, res){
			if(err){
				throw err;
			} else {
				agent.saveCookies(res);
			}
			done();
		});
	});
	it("should pass the user auth", function(done) {
		agent.get('http://localhost:3000/check')
		.end(function(err, res){
			expect(res.status).to.be(200);
			expect(res.body).to.be('logged in');
			done();
		});
	});
	it("should refuse to craete a duplicate user name", function(done) {
		agent.post('http://localhost:3000/user')
		.send({
			firstName :'moe',
			lastName: 'moe',
			name: 'ss',
			email: 'e@test.com',
			password: 'ss'
		})
		.end(function(res){
			expect(res.status).to.be(403);
			done();
		});
	});
	it("should get all users", function(done) {
		agent.get('http://localhost:3000/user')
		.end(function(res){
			expect(res.status).to.be(200);
			done();
		});
	});
	it("should get a user by name", function(done){
		agent.get('http://localhost:3000/user/ss')
		.end(function(res){
			expect(res.body.name).to.be('ss');
			expect(res.status).to.be(200);
			expect(res.body.name).to.be('ss');
			expect(res.body.name).not.to.be('moka');
			done();
		});
	});
	it("should update the user info", function(done) {
		agent.put('http://localhost:3000/user')
		.send({
			firstName :'moe',
			lastName: 'moe',
			name: 'mohammed',
			email: 'moe@test.com',
			password: 'moe'
		})
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body.name).to.be('mohammed');
			expect(res.body.name).not.to.be('moe');
			done();
		});
	});
	it("should delete the user", function(done) {
		agent.del('http://localhost:3000/user')
		.send({
			firstName :'moe',
			lastName: 'moe',
			email: 'moe@test.com',
			name: 'mohammed',
			password: 'moe'
		})
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body.message).to.be('User has been deleted successfully');
			done();
		});
	});
	it("should create a new user with same credentials", function(done) {
		agent.post('http://localhost:3000/user')
		.send({
			firstName :'moe',
			lastName: 'moe2',
			name: 'ss',
			email: 'e@test.com',
			password: 'ss'
		})
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body.name).to.be('ss');
			expect(res.body.name).not.to.be('mohammed');
			done();
		});
	});
});