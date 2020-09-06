const express = require('express');
const app = express();

const passport = require('passport');
const express_session = require('express-session');

const dotenv = require('dotenv').config();

// Database Setup------------------
const mongoose = require('mongoose');
const mongo_uri = process.env.mongo_uri;

const connect = mongoose.connect(mongo_uri, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: true
});
connect.then(
	(db) => {
		console.log('Database Connected Successfully');
	},
	(err) => {
		console.log('Error occur while connecting ', err);
	}
);
// ----------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// setup passport with express-session-----------
app.use(
	express_session({
		secret: process.env.express_session_secret,
		resave: false,
		saveUninitialized: true
	})
);
app.use(passport.initialize());
app.use(passport.session());
//-------------------------------------------------

var indexPage = require('./routes/index');
var signupPage = require('./routes/signup');

app.use('/', indexPage);
app.use('/signup', signupPage);

// common error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = err;

	// render the error page
	res.status(err.status || 500);
	res.send(undefined);
});

let PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
	console.log('Server started at http://localhost:', PORT);
});
