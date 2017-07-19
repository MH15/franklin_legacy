// manage.js
// ========
// routes for pages under domain/manage/*.*
var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID
var express = require('express'),
	router = express.Router(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session');

// core
var ensure = require('../security/ensure')




// passport login
// required for passport session
router.use(session({secret: "enter custom sessions secret here"}));
router.use(passport.initialize()) // Init passport authentication 
router.use(passport.session()) // persistent login sessions 

router.use('/manage', function(req, res, next) {
  // ... maybe some additional /bar logging ...
  next();
});

router.get('/addpage', function(req, res) {
	res.send("addpage")
});
router.get('/themes', function(req, res) {
	res.send("themes")
});
router.get('/edit', function(req, res) {
	res.send("edit")
});
router.get('/settings', function(req, res) {
	res.send("settings")
});



module.exports = router;



