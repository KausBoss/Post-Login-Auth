const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	username: {
		required: true,
		unique: true,
		type: String,
		trim: true,
		lowercase: true
	},
	email: {
		required: true,
		type: String,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	}
});

UserSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validUserPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
