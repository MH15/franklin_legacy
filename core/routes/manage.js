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
// view engine
// authRouter.set('view engine', 'ejs')
authRouter.use(bodyParser.urlencoded({extended: true}))
authRouter.use(bodyParser.json())
authRouter.use(express.static('public'))
// mongoDB stuff
authRouter.use(ensure)


authRouter.use( (req,res,next) => {
    app = req.app;
    next();
});

authRouter.use('/manage', function(req, res, next) {
  // ... maybe some additional /bar logging ...
  next();
});

authRouter.get('/addpage', (req, res) => {
	addPage(req, res)
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



module.exports = {
	authRouter: authRouter,
	data: {}
};


function addPage(req, res) {
	db = app.get('database')
	var collection = db.collection('page_list')
	var document = {
		pageName: "Contact",
		order: "2",
		timeStamp: new Date().getTime(),
		user: "Steve"


	}
	// collection.insertOne(document, function(err, records){
	// 	console.log("Record added");
	// })
	getPages(collection)
	.then((result) => {
		res.render("addpage.ejs", {result})

	})
	.catch((err) => {
		reject(Error(err))
	})



}


function getPages(collection) {
	return new Promise((resolve, reject) => {
		collection.find({ }).sort({order: 1}).toArray()
		.then((result) => {
			resolve(result)
		})
		.catch((err) => {
			reject(Error(err))
		})
	})
}