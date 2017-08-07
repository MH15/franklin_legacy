// server.js
// ======
var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
	assert = require('assert'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session'),
	requireDir = require('require-dir'),
	async = require('async'),
	request = require('request'),
	http = require('http')

// core
var ensure = require('./core/security/ensure'),
	manageRouter = require('./core/routes/manage')



// view engine
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// routing separation
app.use(require('./core/routes/auth')) // authentication under root domain
app.use(require('./core/routes/edit')) // editing of pages
// pages under domain/manage/*.*
app.use('/manage', manageRouter.authRouter)
// var routes = requireDir('./core/routes')
// for (var i in routes) app.use('/', routes[i])



var dbComplications = require('./core/database')

// promise MongoDB
dbComplications.connectPromise
.then(app.listen(6060, () => {
	console.log('listening on 6060')
})).then((success) => {
	// console.log(success.collection('page_content'));
	db = success
	app.set('database', db)
	return db
}).then((db) => {
	// do a foreach thing to get/post every page in db.collection('page_list')
	RunAnyPage(db)
}).catch(function (error) {
	throw error;
})




// run any page
function RunAnyPage() {
	var page_list = db.collection("page_list"),
			page_content = db.collection("page_content")


	// find array of any page in the root dir for starters

	// page_list.find({ }).toArray((err, result) => {
	// 	var pages = result
	// 	// var requests = 
	// })
	page_list.distinct("pageName", (err, docs) => {
		// var promises = docs.map(function(pageName) {
		// 	return new Promise(function(resolve, reject) {
		// 		// find each of the distinct tags
		// 		// MongoDB find([name]) of type Array returns array of each query
		// 		app.get(`/bbb`, (req, res) => {
		// 			res.send("this was never here... until it was")
		// 			console.log(pageName);
		// 		})
				
		// 	})
		function httpGet(url, callback) {
			const options = {
				url :  url,
				text : true
			};
			request(options,
				function(err, res, body) {
					callback(err, body);
				}
			);
		}

		const urls= [
  		"http://localhost:6060/test",
  		"http://localhost:6060/alm/development_tool",
  		"http://localhost:6060/alm/project_architecture"
		];

		async.map(urls, httpGet, function (err, res){
			if (err) return console.log(err);
			console.log(res);
			res.send("this was never here... until it was")
		});

		// Promise.all(promises)
		// .then(success => {
		// 	console.log("MESSAGEASKMASLMCLKASMCL");
		// }).catch(err => {
		// 	console.log(err);
		// })


	})
}

		// var promises = distinctZones.map(function(name) {
		// 	return new Promise(function(resolve, reject) {
		// 		// find each of the distinct tags
		// 		// MongoDB find([name]) of type Array returns array of each query

		// 		collection.find({zone: name}).sort({franklinID: 1}).toArray(function(err, result) {
		// 			if (true) {
		// 					resolve(result)
		// 					// console.log(result)
		// 				}
		// 				else {
		// 					reject(Error(err));
		// 				}
		// 		})
		// 	})
		// })

			// app.get(`/bbb`, (req, res) => {
			// 	res.send("this was never here")
			// })


app.post('/deletepage', (req, res) => {
	var collection = db.collection("page_list")
	console.log({pageName: req.body.pageName});
	collection.remove({pageName: req.body.pageName}, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Page Deleted");
		}
	 })
	res.send("Page Deleted")
})


// add a new item to the database
app.post('/additem', (req, res) => {
	var collection = db.collection('page_content')
	var document = req.body
	console.log(req.body);
	collection.insertOne(document, function(err, records){
		console.log("Record added");
	})
	res.send('Add Item Success')
	// TODO: save to db
})


// main stuff
app.post('/saveuseredits', (req, res) => {
	var collection = db.collection('page_content')
	var currentID = req.body.franklinID
	var currentZone = req.body.zone
	console.log(req.body)

	var newValues = {
		zone: req.body.zone,
		franklinID: req.body.franklinID,
		content: req.body.content,
		timeStamp: new Date().getTime(),
		user: "Steve"
	}

	// check if document already exists
	// if so, edit document
	// if not, create document
	collection.findOne({zone: currentZone, franklinID: currentID}, function(err, document) {
		if (document) {
			res.send('MongoDB success')
			console.log('MongoDB success')
			collection.update({zone: currentZone, franklinID: currentID}, newValues, function(err, res) {
				if (err) throw err;
			});

		} else {
			res.send('MongoDB failure')
			console.log("Adding new doc")

			var document = newValues
			collection.insertOne(document, function(err, records){
					console.log("Record added");
			})
		} 
	})
})
// clean up MongoDB data
function UpdatePageContent(data) {
	var numZones = data.length
	var ouputObject = { }
	for (var i = 0; i < numZones; i++) {
		var subObjectName = data[i][0].zone
		ouputObject[subObjectName] = []
		for (var y = 0; y < data[i].length; y++) {
			ouputObject[subObjectName][y] = data[i][y]
		}
	}
	return ouputObject
}
function DetermineFranklinStyle(franklinStyle) {
	var style = null
	switch (franklinStyle) {
		case "edit":
			style = "franklin-edit.js"
			break;
		case "view":
			style = "franklin-view.js"
			break;
		default:
			break;
	}
	return style
}

app.get('/', (req, res) => {
	RunSite('template.ejs', "view", req, res)
})
// route to editor if logged in
app.get('/edit', ensureAuthenticated, function(req, res, next) {
	RunSite('edit.ejs', "edit", req, res)
});






app.post('/login',
	passport.authenticate('local', {
		// if login successful route to edit page
		// which is really just a duplicate of the
		// template.ejs file
		successRedirect: '/manage',
		failureRedirect: '/login'
	}), function (req, res) {
		console.log(req.path);
	}

// 	})(req, res, next);
);




passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.get('/loginFailure', function(req, res, next) {
	res.send('Failed to authenticate');
});



passport.use(new LocalStrategy(function(username, password, done) {
	process.nextTick(function() {
		db.collection('credentials').findOne({
			'username': username, 
		}, function(err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false);
			}

			if (user.password != password) {
				return done(null, false);
			}

			return done(null, user);
		});
	});
}));



function RunSite(source, franklinStyle, req, res) {
	collection = db.collection('page_content')

	// make sure to sort content by franklinID before passing
	// to ejs to avoid mangling the result orders
	collection.distinct("zone",(function(err, result) {
		var distinctZones = result
		var promises = distinctZones.map(function(name) {
			return new Promise(function(resolve, reject) {
				// find each of the distinct tags
				// MongoDB find([name]) of type Array returns array of each query

				collection.find({zone: name}).sort({franklinID: 1}).toArray(function(err, result) {
					if (true) {
							resolve(result)
							// console.log(result)
						}
						else {
							reject(Error(err));
						}
				})
			})
		})
		// run all find commands asynchronously
		Promise.all(promises)
		.then(function(result) {
			// send to parser and render EJS
			var dbContent = UpdatePageContent(result)
			var pageData = {
				title: source
			}
			var sources = {
				franklinStyle: DetermineFranklinStyle(franklinStyle)
			}
			// console.log(dbContent)
			res.render("template.ejs", {
				pageData: pageData,
				dbContent: dbContent,
				sources: sources
			})

		}, function(err) {
				console.log(err)
		})
		.catch(console.error)
	 }))

	// console.log(new ObjectID())
}



// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the
//  login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	// console.log(req.path);
	res.redirect('/login')
}

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
	// res.send('what???', 404);
});