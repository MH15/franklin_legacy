// submanage.js
// ========
// routes for pages under domain/manage/*.*
var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID
var express = require('express'),
	authRouter = express.Router(),
	router2 = express.Router(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session');

// core
var ensure = require('../security/ensure')




// passport login
// required for passport session
authRouter.use(session({
	secret: "cookie_secret",
	name: "cookie_name",
	proxy: true,
	resave: true,
	saveUninitialized: true
}));
authRouter.use(passport.initialize()) // Init passport authentication 
authRouter.use(passport.session()) // persistent login sessions 
// view engine
// authRouter.set('view engine', 'ejs')
authRouter.use(bodyParser.urlencoded({extended: true}))
authRouter.use(bodyParser.json())
authRouter.use(express.static('public'))
// mongoDB stuff
authRouter.use(ensure)


