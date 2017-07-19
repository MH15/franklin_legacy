// manage.js
// ========
// routes for pages under domain/manage/*.*
var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID
var express = require('express'),
	authRouter = express.Router(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session');

// core
var ensure = require('../security/ensure')




// passport login
// required for passport session
authRouter.use(session({secret: "enter custom sessions secret here"}));
authRouter.use(passport.initialize()) // Init passport authentication 
authRouter.use(passport.session()) // persistent login sessions 

authRouter.use(ensure)


authRouter.use('/manage', function(req, res, next) {
  // ... maybe some additional /bar logging ...
  next();
});

authRouter.get('/addpage', function(req, res) {
	res.send("addpage")
});
authRouter.get('/themes', function(req, res) {
	res.send("themes")
});
authRouter.get('/edit', function(req, res) {
	res.send("edit")
});
authRouter.get('/settings', function(req, res) {
	res.send("settings")
});



module.exports = authRouter;



