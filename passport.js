const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
	done(null, user.username);
});

passport.deserializeUser((username, done) => {
	User.findOne({
		username: username
	}).exec((err, user) => {
		if (err || !user) {
			return done(err || new Error('No Such User Exist'));
		}
		return done(null, user);
	});
});

passport.use(
	new LocalStrategy(function(username, password, done) {
		console.log(username, ' ', password);
		User.findOne({ username: username }, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username or such user exist' });
			}
			if (!user.validUserPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	})
);

module.exports = passport;
