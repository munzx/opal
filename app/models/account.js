var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var accountsSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		default: '',
		trim: true,
		unique: true,
		lowercase: true,
		sparse: true,
		match: [/.+\@.+\..+/, 'Please provide a valid email address']
	},
    provider:  String,
    providerUserId:  String,
    accessToken: String,
    user: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    date: {type: Date, default: Date.now}
}, {strict: true});

module.exports = mongoose.model('accounts', accountsSchema);