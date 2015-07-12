'use strict';

var expect = require('expect.js'),
superagent = require('superagent'),
mongoose = require('mongoose'),
product = require('../models/product');


//test variables
var agent = superagent.agent(),
	baseProduct,
	baseOrder,
	baseComment,
	baseHeart,
	baseCart;

describe("product test", function() {
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
	it("Should pass the user auth", function(done) {
		agent.get('http://localhost:3000/check')
		.end(function(err, res){
			expect(res.status).to.be(200);
			expect(res.body).to.be('logged in');
			done();
		});
	});
	it("Should create a new product", function(done) {
		agent.post('http://localhost:3000/product')
		.send({
			name: 'test',
			desc: 'here is a test product',
			category: 'women',
			image: 'image'
		})
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body.name).to.be('test');
			expect(res.body.user).to.not.be.empty();
			expect(res.body.created).not.to.be.empty();
			baseProduct = res.body;
			done();
		});
	});
	it("Should create another new product", function(done) {
		agent.post('http://localhost:3000/product')
		.send({
			name: 'test22',
			desc: 'here is a test product',
			category: 'women',
			image: 'image'
		})
		.end(function(res){
			expect(res.body.name).to.be('test22');
			expect(res.status).to.be(200);
			expect(res.body.name).to.be('test22');
			expect(res.body.user).to.not.be.empty();
			expect(res.body.created).not.to.be.empty();
			done();
		});
	});
	it("Should refuse to create a deuplicate product name", function(done) {
		agent.post('http://localhost:3000/product')
		.send({
			name: 'test',
			desc: 'here is a test product',
			category: 'women',
			image: 'image'
		})
		.end(function(res){
			expect(res.status).to.be(500);
			done();
		});
	});
	it("Should get all products", function(done) {
		agent.get('http://localhost:3000/product')
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body[0].name).to.be('test');
			done();
		});
	});
	it("Should get a product by name", function(done) {
		agent.get('http://localhost:3000/product/test')
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body.name).to.be('test');
			expect(res.body.image).to.be('image');
			done();
		});
	});
	it("Should update a product by id", function(done) {
		agent.put('http://localhost:3000/product/' + baseProduct._id)
		.send({
			name: 'updated_product',
			desc: 'here is a test product',
			category: 'women',
			image: 'image'
		})
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body.name).to.be('updated_product');
			done();
		});
	});
	it("Should get products in a certain category", function(done) {
		agent.get('http://localhost:3000/product/category/women')
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body[0].name).to.be('updated_product');
			done();
		});
	});

	it("Should not find any product in the cart", function(done) {
		agent.get('http://localhost:3000/user/cart/products')
		.end(function(res) {
			expect(res.body).to.be.empty();
			expect(res.status).to.be(200);
			done();
		});
	});
	it("Should add a product to the cart", function(done) {
		agent.post('http://localhost:3000/user/cart/' + baseProduct._id) //double check why it passes even if the sent data it wrong!!!!
		.send({
			name: 'testa',
			desc: 'testa2',
			category: 'men',
			image: 'asdkasdjlhsaldhjas',
			productId: baseProduct._id
		})
		.end(function(res) {
			expect(res.body.cart[0].productId).to.be(baseProduct._id);
			expect(res.status).to.be(200);
			done();
		});
	});
	it("Should add another product to the cart", function(done) {
		agent.post('http://localhost:3000/user/cart/' + baseProduct._id) //double check why it passes even if the sent data was wrong!!!!
		.send(baseProduct)
		.end(function(res) {
			expect(res.body.cart[0].productId).to.be(baseProduct._id);
			expect(res.status).to.be(200);
			baseCart = res.body.cart;
			done();
		});
	});
	it("Should remove the first product in the cart", function(done) {
		agent.del('http://localhost:3000/user/cart/' + baseCart[0]._id)
		.end(function(res) {
			expect(res.status).to.be(200);
			done();
		});
	});
	it("Should make sure the first product added to the cart has been removed", function(done) {
		agent.get('http://localhost:3000/user/cart/products')
		.end(function (res) {
			expect(res.body[0]._id).not.to.be(baseCart[0]._id); //not the same id as the removed one
			expect(res.body[0]._id).to.be(baseCart[1]._id); //to be thee same as the other existing id
			done();
		});
	});
	it("Should not find any orders for the product", function(done) {
		agent.get('http://localhost:3000/product/' + baseProduct._id +'/order')
		.end(function(res) {
			expect(res.status).to.be(200);
			expect(res.body).to.be.empty();
			done();
		});
	});
	it("Should create an order", function(done) {
		agent.post('http://localhost:3000/product/' + baseProduct._id + '/order')
		.send({
			address: 'somewhere',
			quantity: 4,
			price: '2000',
			status: 'Pendding'
		})
		.end(function(res) {
			expect(res.body.order[0].price).to.be('2000');
			expect(res.status).to.be(200);
			baseOrder = res.body.order[0];
			done();
		});
	});
	it("Should get an empty cart", function(done) {
		agent.get('http://localhost:3000/user/cart/products')
		.end(function(res) {
			expect(res.body).to.be.empty();
			expect(res.status).to.be(200);
			done();
		});
	});
	it("Should refuse to create another order as the cart is empty", function(done) {
		agent.post('http://localhost:3000/product/' + baseProduct._id + '/order')
		.send({
			address: 'somewhere2',
			quantity: 4,
			price: '4000',
			status: 'Pendding'
		})
		.end(function(res) {
			expect(res.body.message).to.be('Cart is empty');
			expect(res.status).to.be(401);
			done();
		});
	});
	it("Should get all orders of a product", function(done) {
		agent.get('http://localhost:3000/product/' + baseProduct._id +'/order')
		.end(function(res) {
			expect(res.body[0].address).to.be('somewhere');
			expect(res.body[0].user).not.to.be.empty();
			expect(res.body[0].created).not.to.be.empty();
			done();
		});
	});
	it("Should get order info by ID", function(done) {
		agent.get('http://localhost:3000/product/' + baseProduct._id +'/order/' + baseOrder._id)
		.end(function(res) {
			expect(res.status).to.be(200);
			expect(res.body.address).to.be('somewhere');
			done();
		});
	});
	it("Should update an order by ID", function(done) {
		agent.put('http://localhost:3000/product/' + baseProduct._id + '/order/' + baseOrder._id)
		.send({
			address: 'updateSomewhere',
			quantity: 4,
			price: '2000',
			status: 'Pendding'
		})
		.end(function(res) {
			expect(res.body.order[0].address).to.be('updateSomewhere');
			done();
		});
	});
	it("Should delete the order", function(done) {
		agent.del('http://localhost:3000/product/' + baseProduct._id + '/order/' + baseOrder._id)
		.end(function(res) {
			expect(res.body).to.be('order has been deleted successfully');
			expect(res.status).to.be(200);
			done();
		});
	});
	it("Should not find any comment", function(done) {
		agent.get('http://localhost:3000/product/' + baseProduct._id + '/comment')
		.end(function(res) {
			expect(res.status).to.be(200);
			expect(res.body).to.be.empty();
			done();
		});
	});
	it("Should create a new comment", function(done) {
		agent.post('http://localhost:3000/product/' + baseProduct._id + '/comment')
		.send({ content: 'Bism Allah'})
		.end(function(res) {
			expect(res.body[0].content).to.be('Bism Allah');
			expect(res.body[0].author[0].name).to.be('ss');
			expect(res.status).to.be(200);
			baseComment = res.body[0];
			done();
		});
	});
	it("Should delete a comment", function (done) {
		agent.del('http://localhost:3000/product/' + baseProduct._id + '/comment/' + baseComment._id)
		.end(function(res) {
			expect(res.status).to.be(200);
			done();
		});
	});
	it("Should assure that comment has been removed successfully", function(done) {
		agent.get('http://localhost:3000/product/' + baseProduct._id + '/comment')
		.end(function(res) {
			expect(res.status).to.be(200);
			expect(res.body).to.be.empty();
			done();
		});
	});
	it("Should not find a heart for the product", function(done) {
		agent.get('http://localhost:3000/product/' + baseProduct._id + '/heart')
		.end(function(res) {
			expect(res.status).to.be(200);
			expect(res.body).to.be.empty();
			done();
		});
	});
	it("Should heart a product", function(done) {
		agent.post('http://localhost:3000/product/' + baseProduct._id + '/heart')
		.send({ rate: 5})
		.end(function(res) {
			expect(res.body[0].user[0].name).to.be('ss');
			expect(res.status).to.be(200);
			baseHeart = res.body[0];
			done();
		});
	});
	it("Should unheart a product", function(done) {
		agent.del('http://localhost:3000/product/' + baseProduct._id + '/heart/' + baseHeart._id)
		.end(function(res) {
			expect(res.status).to.be(200);
			done();
		});
	});
	it("Should assure product has been unhearted! successfully!", function(done) {
		agent.get('http://localhost:3000/product/' + baseProduct._id + '/heart')
		.end(function(res) {
			expect(res.status).to.be(200);
			expect(res.body).to.be.empty();
			done();
		});
	});
	it("Should delete the first product", function(done) {
		agent.del('http://localhost:3000/product/' + baseProduct._id)
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body).to.be('successfully deleted the product');
			done();
		});
	});
	it("Should assure the first product has been deleted successfully", function(done) {
		agent.get('http://localhost:3000/product')
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body[0].name).to.be('test22');
			baseProduct = res.body[0]; //assign the second product value to the baseProduct
			done();
		});
	});
	it("Should delete the second product", function(done) {
		agent.del('http://localhost:3000/product/' + baseProduct._id)
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body).to.be('successfully deleted the product');
			done();
		});
	});
	it("Should assure the second product has been deleted successfully", function(done) {
		agent.get('http://localhost:3000/product')
		.end(function(res){
			expect(res.status).to.be(200);
			expect(res.body).to.be.empty();
			done();
		});
	});
});