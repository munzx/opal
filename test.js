'use strict';

var expect = require('expect.js'),
superagent = require('superagent'),
mongoose = require('mongoose'),
product = require('./app/models/product');

//test variables
var agent = superagent.agent(),
	url = 'http://localhost:3000/api/v1/',
	productID = '',
	commentID = '',
	heartID = '',
	cartItemID = '';

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
			expect(res.body).to.be('logged in');
			done();
		});
	});
	//=================== product ========================//
	it("should get a product name koko", function(done) {
		agent.get(url + 'product/koko')
		.end(function (err, res) {
			expect(res.body.name).to.be('koko');
			productID = res.body._id;
			done();
		});
	});
	//=================== Commentd =====================//
	it("should add a comment", function(done) {
		agent.post(url + 'product/' + productID +'/comment')
		.send({
			content: 'Bism Allah'
		})
		.end(function (err, res) {
			expect(res.body.content).to.be('Bism Allah');
			commentID = res.body._id;
			done();
		});
	});
	it("should delete a comment", function(done) {
		agent.del(url + 'product/' + productID + '/comment/' + commentID)
		.end(function (err, res) {
			expect(res.body).to.be('Comment has been deleted successfully');
			done();
		});
	});
	//======================= Heart ==========================//
	it("should heart  a product", function(done) {
		agent.post(url + 'product/' + productID + '/heart')
		.end(function (err, res) {
			expect(res.status).to.be(200);
			heartID = res.body.heart._id;
			done();
		});
	});
	it("should unheart  a product", function(done) {
		agent.del(url + 'product/' + productID + '/heart')
		.end(function (err, res) {
			expect(res.status).to.be(200);
			done();
		});
	});
	//========================= cart ============================//
	it("should add a product to cart", function(done) {
		agent.post(url + 'user/cart/' + productID)
		.send({product: {
			price: 23234,
			quantity: 12
		}})
		.end(function (err, res) {
			expect(res.status).to.be(200);
			cartItemID = res.body.cart._id;
			done();
		});
	});
	it("should add a product to cart", function(done) {
		agent.post(url + 'user/cart/' + productID)
		.send({product: {
			price: 23234,
			quantity: 12
		}})
		.end(function (err, res) {
			expect(res.status).to.be(200);
			cartItemID = res.body.cart._id;
			done();
		});
	});
	// it("should update the product in the cart", function(done) {
	// 	agent.put(url + '/user/cart')
	// 	.end(function (err, res) {
	// 		expect(res.status).to.be(200);
	// 		done();
	// 	});
	// });
	// it("should delete the product in cart", function(done) {
	// 	agent.del(url + '/user/cart/' + productID)
	// 	.end(function (err, res) {
	// 		expect(res.status).to.be(200);
	// 		done();
	// 	});
	// });
});