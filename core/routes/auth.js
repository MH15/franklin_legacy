// auth.js
// ==========
// authentication security & routing
var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID
var express = require('express'),
	openRouter = express.Router(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session');





// passport login
// required for passport session
openRouter.use(session({
    secret: "cookie_secret",
    name: "cookie_name",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
openRouter.use(passport.initialize()) // Init passport authentication 
openRouter.use(passport.session()) // persistent login sessions 


// login & security
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));



// simply to logout users
openRouter.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

openRouter.get('/login', function(req, res) {
	res.render('login.ejs', {output: null})
})



module.exports = openRouter;