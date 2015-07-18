var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var inkSchema = new Schema({
	oem: {
		type: String,
		default: '',
		trim: true,
		required: 'Please provide OEM brand name',
		lowercase: true
	},
	mpn: {
		type: String,
		default: '',
		trim: true,
		required: 'Please provide mpn',
		lowercase: true
	},
	desc: {
		type: String,
		default: '',
		trim: true,
		lowercase: true
	},
	quantity: {
		type: Number,
		trim: true,
		default: 0
	},
	condition: {
		type: String,
		default: '',
		trim: true,
		enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 't'],
		lowercase: true,
		required: 'Please provide the product condition'
	},
	user: [{ type: Schema.Types.ObjectId, ref: 'user' }],
	source: {
		type: String,
		default: '',
		trim: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

inkSchema.index({ oem: 1, mpn: 1 , condition: 1}, { unique: true });

module.exports = mongoose.model('ink', inkSchema);