// database.js
// ========
var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID
var express = require('express'),
	router = express.Router(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session');





// passport login
// required for passport session
router.use(session({secret: "enter custom sessions secret here"}));
router.use(passport.initialize()) // Init passport authentication 
router.use(passport.session()) // persistent login sessions 




module.exports = router;