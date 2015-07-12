'user strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var contactSchema = new Schema({
	fullName: {
		type: String,
		default: '',
		trim: true,
		required: 'Please provide your full name',
		lowercase: true
	},
	email: {
		type: String,
		default: '',
		trim: true,
		required: 'Please provide your email address',
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		lowercase: true,
	},
	department: {
		type: String,
		default: '',
		enum: ['marketing & sales','i.t','customer service'],
		trim: true,
		lowercase: true,
		required: 'Please select the department'
	},
	reason: {
		type: String,
		default: '',
		enum: ['suggestion','inquery','complaint'],
		trim: true,
		lowercase: true,
		required: 'Please select the contact reason'
	},
	message: {
		type: String,
		default: '',
		trim: true,
		required: 'Please provide the message'
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('contact', contactSchema);