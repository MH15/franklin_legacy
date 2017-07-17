// pages.js
// ========
var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID
var express = require('express'),
	router = express.Router(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session');


// simply to logout users
router.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});



module.exports = router;