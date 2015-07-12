'use strict';

//Dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var categorySchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: 'Fill the sub category name',
		lowercase: true,
		trim: true
	},
	parent: {
		type: String,
		default: 'root',
		required: 'Parent is required',
		trim: true,
		lowercase: true
	},
	active: {
		type: String,
		default: 'true',
		trim: true,
		lowercase: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('category', categorySchema);