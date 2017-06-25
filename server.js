var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
	assert = require('assert'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session');



// edit express configuration
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
// passport login
// required for passport session
app.use(session({secret: "enter custom sessions secret here"}));
app.use(passport.initialize()) // Init passport authentication 
app.use(passport.session()) // persistent login sessions 
// view engine
app.set('view engine', 'ejs')

// init MongoDB
// TODO: Adjust credentials
var db

MongoClient.connect('mongodb://MH15:MHall123@ds161901.mlab.com:61901/franklin-db', (err, database) => {
	if (err) return console.log(err)
	db = database

	app.listen(6060, () => {
		console.log('listening on 6060')
	})
})

// login & security
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));


// main stuff
app.post('/saveuseredits', (req, res) => {
	var collection = db.collection('page_content')
	var currentID = req.body.franklinID
	var currentZone = req.body.zone
	// console.log(req.body)

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

app.get('/', (req, res) => {
	RunSite('app.ejs', req, res)
})


app.get('/login', function(req, res) {
	res.render('login.ejs', {output: null})
})

app.post('/login',
	passport.authenticate('local', {
		// if login successful route to edit page
		// which is really just a duplicate of the
		// app.ejs file TODO: remove editing capability
		// on the regular view
		successRedirect: '/edit',
		failureRedirect: '/loginFailure'
	})
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

// route to editor if logged in
app.get('/edit', ensureAuthenticated, function(req, res, next) {
	RunSite('edit.ejs', req, res)
});

passport.use(new LocalStrategy(function(username, password, done) {
	process.nextTick(function() {
		console.log("working")
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

function RunSite(source, req, res) {
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
			var output = UpdatePageContent(result)
			res.render(source, {output: output})

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
  res.redirect('/login')
}

app.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("acess granted");
});

// simply to logout users
app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});
