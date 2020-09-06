const express = require('express');
const router = express.Router();

const User = require('../models/user');

const passport = require('../passport');

router.post('/signup', (req, res) => {
	console.log(req.body.user);

	User.findOne({
		email: req.body.user.email,
		username: req.body.user.username
	}).exec((err, found_user) => {
		if (err) {
			console.log('error in /signup');
			return res.send(undefined);
		}
		if (found_user) {
			console.log('Already exist detail in /signup');
			return res.send(undefined);
		}

		const newUser = new User();
		(newUser.username = req.body.user.username),
			(newUser.email = req.body.user.email),
			(newUser.name = req.body.user.name),
			(newUser.password = newUser.encryptPassword(req.body.user.password));

		User.create(newUser, (err, new_user) => {
			if (err) {
				console.log('error in /signup while creating');
				return res.send(undefined);
			}
			if (!new_user) {
				console.log('no user in /signup while creating');
			}
			console.log(new_user);
			return res.send(new_user);
		});
	});
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: '/login/failure',
		successRedirect: '/login/success'
	})
);

module.exports = router;
