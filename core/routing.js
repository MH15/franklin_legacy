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



// init MongoDB
var db, username, password, collection
username = "MH15"
password = "MHall123"
collection = "franklin-db"

MongoClient.connect(`mongodb://${username}:${password}@ds161901.mlab.com:61901/${collection}`, (err, database) => {
	if (err) return console.log(err)
	db = database

	// app.listen(6060, () => {
	// 	console.log('listening on 6060')
	// })
})

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())
router.use(express.static('public'))
// passport login
// required for passport session
router.use(session({secret: "enter custom sessions secret here"}));
router.use(passport.initialize()) // Init passport authentication 
router.use(passport.session()) // persistent login sessions 




module.exports = router;