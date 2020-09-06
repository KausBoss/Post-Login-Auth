const express = require('express');
const route = express.Router();
const User = require('../models/user');

// Get /profile
route.get('/profile', (req, res, next) => {
	// return res.render('profile',{title:'Profile'})
	if (!req.session.userID) {
		return res.redirect('/login');
	}
	User.findById(req.session.userID).exec((err, user) => {
		if (err) return next(err);
		return res.render('profile', { title: 'Profile', name: user.name, movie: user.movie });
	});
});

// GET /login
route.get('/login', (req, res, next) => {
	return res.render('index');
});
// POST /login
route.post('/login', (req, res, next) => {
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, (err, user) => {
			if (err || !user) {
				let err = new Error('Wrong Email or Password');
				err.status = 401;
				return next(err);
			}
			req.session.userID = user._id;
			return res.redirect('/profile');
		});
	} else {
		let err = new Error('You need to enter both email and password');
		err.status = 401;
		return next(err);
	}
});
// Get /register
route.get('/register', (req, res, next) => {
	return res.render('signup');
});
// Post /register
route.post('/register', (req, res, next) => {
	if (req.body.name && req.body.password && req.body.movie && req.body.email) {
		var userData = {
			name: req.body.name,
			movie: req.body.movie,
			password: req.body.password,
			email: req.body.email
		};
		User.create(userData, (err, user) => {
			if (err) return next(err);
			req.session.userID = user._id;
			return res.redirect('/profile');
		});
	} else {
		let err = new Error('You need to enter all the information');
		err.status = 400;
		return next(err);
	}
});

// Get /
route.get('/', (req, res, next) => {
	return res.render('index');
});

module.exports = route;
