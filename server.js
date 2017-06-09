var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var MongoClient = require('mongodb').MongoClient

// edit express configuration
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
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


app.post('/edit', (req, res) => {
	db.collection('data').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	})
})

app.post('/saveuseredits', (req, res) => {
	var collection = db.collection('page_content')
	var currentID = req.body.franklinID
	console.log(currentID)

	var newValues = {
		franklinID: req.body.franklinID,
		content: req.body.content,
		timeStamp: new Date().getTime(),
		user: "Steve"
	}

	// collection.find(query).toArray(function(err, result) {
	// if (err) throw err;
	// 	console.log(result);
	// 	// db.close();
	// })

	// check if document already exists
	// if so, edit document
	// if not, create document
	collection.findOne({franklinID: currentID}, function(err, document) {
		if (document) {
			res.send('MongoDB success')
			console.log("doc exists")
			collection.update({franklinID: currentID}, newValues, function(err, res) {
    			if (err) throw err;
    			console.log(res.result.nModified + " record updated");
    			// db.close();
  			});

		} else {
			res.send('MongoDB failure')
			console.log("doc doesn't exist") 
			// save new document
			// collection.save(req.body, (err, result) => {
			// 	if (err) return console.log(err)
			// 	console.log('saved to database')
			// 	// res.redirect('/')
			// })
		} 


	})

	
})

app.get('/', (req, res) => {
	// db.collection('data').find().toArray((err, result) => {
	// 	if (err) return console.log(err)
	// 	// renders index.ejs
	// 	res.render('index.ejs', {data: result})
	// })
	db.collection('page_content').find().toArray((err, result) => {
		if (err) return console.log(err)
		// renders index.ejs
		// res.render('index.ejs', {ejsData: result})
		
		// console.log(result)
	})
	// make sure to sort content by franklinID before passing
	// to ejs to avoid mangling the result orders
	db.collection('page_content').find().sort({franklinID: 1}).toArray(function(err, result) {
    	if (err) throw err;
    	console.log(result);
    	res.render('app.ejs', {ejsData: result})
    	// db.close();
  	})
})


// app.put('/edit', (req, res) => {
// 	db.collection('data')
// 	.findOneAndUpdate({title: 'alpha'}, {
// 		$set: {
// 			name: req.body.title,
// 			quote: req.body.content
// 		}
// 	}, {
// 		sort: {_id: -1},
// 		upsert: true
// 	}, (err, result) => {
// 		if (err) return res.send(err)
// 		res.send(result)
// 	})
// })