// auth.js
// ==========
// authentication routing
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
openRouter.use(session({secret: "enter custom sessions secret here"}));
openRouter.use(passport.initialize()) // Init passport authentication 
openRouter.use(passport.session()) // persistent login sessions 




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