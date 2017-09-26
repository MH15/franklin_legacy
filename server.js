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
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static('public'))
app.use(express.static('~data'))

// routing separation
app.use(require('./core/routes/auth')) // authentication under root domain
app.use(require('./core/routes/edit')) // editing of pages
// pages under domain/manage/*.*
app.use('/manage', manageRouter.authRouter)




var dbComplications = require('./core/database')
var Backend = require('./core/lib/backend')
var UI = require('./core/lib/ui')

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
app.get('/:root_dir?/:sub_dir?', function(req, res) {
	// res.render('page' + req.params.id, { title: 'Express' });
	console.log(req.params);
	FindPage(req, res)
})

// register a new zone through the ways
app.post('/postsection', (req, res) => {
	var pageDB = db.collection("page_list")
	var body = req.body
	pageDB.findOne({pageName: body.pageName}, (err, result) => {
		var register = result

		if (register.pageData.length > 0) { // here if zones already exist
			var length = register.pageData.length
			console.log(length);
			register.pageData[length] = {
					title: body.section,
					content: [] 
			}
			pageDB.update({pageName: req.body.pageName}, register, function(err, result) {
				console.log("successful POST junk");
				res.send("abc")
			})
		} else { // here if nah mate
			register.pageData = [ // add first zone
				{
					title: body.section,
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

app.post('/saveimagetodisk', (req, res) => {
	var pageDB = db.collection("page_list")
	console.log(req.body.matter);
	Backend.SaveImageToDisk(req.body.matter.data, req.body.matter.name)
	.then(src => {
		res.send(src)
	}).catch(err => {
			console.log(err);
	})
})

app.post('/updateitem', (req, res) => {
	var pageDB = db.collection("page_list")
	Backend.EditItem(pageDB, req)
	.then(() => {
		res.send("text done")
	}).catch(err => {
		console.log(err);
	})
})


// register a new item through the ways
app.post('/registeritem', (req, res) => {
	var pageDB = db.collection("page_list")
	var body = req.body
	pageDB.findOne({pageName: body.pageName}, (err, result) => {
		// decide which pragma to use to save the data
		switch (req.body.matter.type) {
			case "text":
				Backend.AddItem(req, pageDB, result, req.body.matter)
				.then(() => {
					res.send("text done")
				}).catch(err => {
					console.log(err);
				})
				break;
			case "image":
				Backend.SaveImage(req.body.matter.data, req.body.matter.name)
				.then(src => {
					// log url to database
					console.log(src)
					var imageDOM = `<img width='200' src='${src}'/>`
					Backend.AddItem(req, pageDB, result, req.body.matter, imageDOM)
					.then(() => {
						res.send("image saved")
					}).catch(err => {
						console.log(err);
					})
				}).catch(err => {
						console.log(err);
				})
				break;
			case "markdown":
				// postMatter = matter.text
				break;
			case "html":
				// postMatter = matter.text
				break;
		}
	})
})


// generate a page from template and content
function Make(pageTitle, req, res, pageDB) {
	console.log(pageTitle);
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
				meta.editorTemplate = "editor"
				UI.Render(res, meta, data, template)
			} else {
				UI.Render(res, meta, data, template)
			}
		} else {
	  	// not logged in
	  	if (pageData) { // if page is not blank
				meta.message = "This page is blank."
				// paramater to feed to edit function
				// tell editor if pageData exists
				meta.phaseScript = ""
				UI.Render(res, meta, data, template)
			} else {
				UI.Render(res, meta, data, template)
			}
		}
		
	})
}

app.post('/deletesection', (req, res) => {
	var pageDB = db.collection("page_list")
	// get right page
	pageDB.findOne({pageName: req.body.pageTitle}, (err, result) => {
		// no need to check if content exists because deleters won't
		// show up unless content.length is defined
		var sectionIndex = result.pageData.findIndex(el => {
			if (el.title === req.body.section) return true;
		})
		var register = result;
		if(register.pageData[sectionIndex]) {
			register.pageData.splice(sectionIndex, 1)
		}



		// console.log(`name: ${req.body.matter.name}, itemIndex: ${itemIndex}`);

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
		var rootDir = req.params.root_dir
		if (rootDir == undefined) {
			res.send("a")
		} else {
			page_list.distinct("pageName", (err, docs) => {
				if (docs.includes(rootDir)) {
					Make(rootDir, req, res, page_list)
				} else { 
					// trigger a 404
					// TODO: custom 404 page
					res.status(400);
					res.send('404: File Not Found');
				}
			})
		}
	}

}



app.post('/deletepage', (req, res) => {
	var pageDB = db.collection("page_list")
	console.log(req.body);
	Backend.DeletePage(pageDB, req.body.title)
	.then(() => {
		res.send("page deleted")
	}).catch(err => {
		console.log(err);
	})
})

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

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});