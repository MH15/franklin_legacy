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
	// RunAnyPage(db)
}).catch(function (error) {
	throw error;
})

// render any and all site pages
app.get('/:page_name', function(req, res) {
	// res.render('page' + req.params.id, { title: 'Express' });
	FindPage(req, res)
})

// register a new zone through the ways
app.post('/registerzone', (req, res) => {
	var pageDB = db.collection("page_list")
	var body = req.body
	pageDB.findOne({pageName: body.pageName}, (err, result) => {
		var register = result

		if (register.pageData.length > 0) { // here if zones already exist
			var length = register.pageData.length
			console.log(length);
			register.pageData[length] = {
					title: body.zoneName,
					content: [] 
			}
			pageDB.update({pageName: req.body.pageName}, register, function(err, result) {
				console.log("successful POST junk");
				res.send("abc")
			})
		} else { // here if nah mate
			register.pageData = [ // add first zone
				{
					title: body.zoneName,
					content: [] 
				}
			]
			pageDB.update({pageName: req.body.pageName}, register, function(err, result) {
				console.log("successful POST junk");
				res.send("abc")
			})
		}
		// contentToRegister.content

	})

})


// register a new item through the ways
app.post('/registeritem', (req, res) => {
	var pageDB = db.collection("page_list")
	var body = req.body
	pageDB.findOne({pageName: body.pageName}, (err, result) => {
		var register = result
		if (result.pageData.length > 0) { // here if zones already exist
			var lengthA = register.pageData.length
			// find location of zone + content in a pageData instance
			var index = result.pageData.findIndex(el => {
				if (el.title === body.zoneName) {
					return true;
				}
			})
			if (register.pageData[index].content) { // if zone already has content
				zoneLength = register.pageData[index].content.length
				register.pageData[index].content[zoneLength] = req.body.text
				pageDB.update({pageName: req.body.pageName}, register, function(err, result) {
					console.log("successful POST junk");
					res.send("abc")
				})
			} else { // if zone is empty
				register.pageData[index].content = [] // init empty array
				register.pageData[index].content[0] = req.body.text
				pageDB.update({pageName: req.body.pageName}, register, function(err, result) {
					console.log("successful POST junk");
					res.send("abc")
				})
			}
			register.pageData[index].content
		}
	})
})

app.post('/deleteitem', (req, res) => {
	var pageDB = db.collection("page_list")
	pageDB.findOne({pageName: req.body.pageTitle}, (err, result) => {
		// no need to check if content exists because deleters won't
		// show up unless content.length is defined
		var sectionIndex = result.pageData.findIndex(el => {
			if (el.title === req.body.section) return true;
		})
		var itemIndex = result.pageData[sectionIndex].content.findIndex(el => {
			if (el === req.body.matter) return true;
		})
		var register = result;
		if(register.pageData[sectionIndex].content[itemIndex]) {
			register.pageData[sectionIndex].content.splice(itemIndex, 1)
		}
		pageDB.update({pageName: req.body.pageTitle}, register, function(err, result) {
			console.log("successful DELETE junk");
			// Make(req.body.pageTitle, req, res, pageDB)
			res.send("done")
		})
	})
})

// run any page
function FindPage(req, res) {
	var page_list = db.collection("page_list"),
			page_content = db.collection("page_content")

	if (req.params) {
		var pageName = req.params.page_name
		page_list.distinct("pageName", (err, docs) => {
			if (docs.includes(pageName)) {
				Make(pageName, req, res, page_list)
			} else { 
				// trigger a 404
				// TODO: custom 404 page
				res.status(400);
				res.send('404: File Not Found');
			}
		})
	}

}

// generate a page from template and content
function Make(pageTitle, req, res, pageDB) {
	pageDB.find({pageName: pageTitle}).toArray((err, result) => {
		var template = result[0].template
		var pageData = result[0].pageData
		var meta = {
			title: pageTitle,
			message: "",
			phaseScript: "" // optional: edit
		}
		var data = pageData
		if (true) { // if logged in: (req.user)
			// logged in
			if (pageData) { // if page is not blank
				meta.message = "This page is blank. Add content!"
				// paramater to feed to edit function
				// tell editor if content exists
				meta.phaseScript = "franklin-edit2.js"
				render(res, meta, data, template)
			} else {
				render(res, meta, data, template)
			}
		} else {
	  	// not logged in
	  	if (pageData) { // if page is not blank
				meta.message = "This page is blank."
				// paramater to feed to edit function
				// tell editor if pageData exists
				meta.phaseScript = ""
				render(res, meta, data, template)
			} else {
				render(res, meta, data, template)
			}
		}
		
	})
}


function render(res, meta, data, template) {
	res.render(`admin/${template}.ejs`, {
		meta: meta,
		data: data
	})
}

app.post('/deletepage', (req, res) => {
	var collection = db.collection("page_list")
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