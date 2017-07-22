// manage.js
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



authRouter.use((req,res,next) => {
	app = req.app;
	next();
});

// management console home
authRouter.get('/', function(req, res) {
	ManageSite('manage.ejs', req, res)
	console.log("in directory /manage");
});




authRouter.use('/manage/', function(req, res, next) {
	next();
});



authRouter.route('/addpage')
.all((req, res, next) => {
	next()
})
.get((req, res, next) => {
	// running page
	console.log("in directory /manage/addpage");
	runAddPage(req, res)
})
.post((req, res, next) => {
	db = app.get('database')
	var collection = db.collection('page_list')
	getPages(collection)
	.then((pages) => {
		var document = {
			pageName: req.body.newPageName,
			order: (pages.length).toString(),
			timeStamp: new Date().getTime(),
			user: "Steve"
		}

		collection.insertOne(document, function(err, records){
			console.log("Record added");
		})
		runAddPage(req, res)
	})
	.catch((err) => {
		reject(Error(err))
	})
})


// authRouter.post('/deletepage', (req, res) => {
// 	console.log("next 3");
// 	console.log(req);
// 	res.send("nah")
// })

// authRouter.route('/deletepage')
// .all((req, res, next) => {
// 	console.log("next 1");
// 	db = app.get("database")
// 	collection = db.collection
// 	next()
// })
// .get((req, res, next) => {
// 	console.log("next 2");
// 	console.log("ya no mate");
// 	res.send("ya no mate")
// 	next()
// })



authRouter.get('/themes', function(req, res) {
	res.send("themes")
});
authRouter.get('/edit', function(req, res) {
	res.send("edit")
});
authRouter.get('/settings', function(req, res) {
	res.send("settings")
});





var runAddPage = (req, res) => {
	db = app.get('database')
	var collection = db.collection('page_list')
	getPages(collection)
	.then((result) => {
		res.render("addpage.ejs", {result})
	})
	.catch((err) => {
		reject(Error(err))
	})
}


module.exports = {
	authRouter: authRouter,
	runAddPage: runAddPage
}

function getPages(collection) {
	return new Promise((resolve, reject) => {
		collection.find({ }).toArray()
		.then((pages) => {
			resolve(pages)
		})
		.catch((err) => {
			reject(Error(err))
		})
	})
}



function ManageSite(source, req, res) {
	var pageData = {
		title: source
	}
	res.render(source, {
		pageData: pageData
	})
}