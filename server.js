var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID,
    assert = require('assert');

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

		// console.log('saved to database')
		res.redirect('/')
	})
})

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
				// console.log(res.result.nModified + " record updated");
				// db.close();
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
	var ouputObject = {
		/* structure should be like so:
		zoneNameOne: {
			content: <etc>
		},
		zoneNameTwo: {
			content: <etc>
		}
		*/
	}
	for (var i = 0; i < numZones; i++) {
		var subObjectName = data[i][0].zone
		ouputObject[subObjectName] = []
		for (var y = 0; y < data[i].length; y++) {
			ouputObject[subObjectName][y] = data[i][y]
			// console.log("data[i][y]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
			// console.log(data[i][y])
		}
	}

	return ouputObject
}


app.get('/', (req, res) => {
	// db.collection('data').find().toArray((err, result) => {
	// 	if (err) return console.log(err)
	// 	// renders index.ejs
	// 	res.render('index.ejs', {data: result})
	// })
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
			res.render('app.ejs', {output: output})

		}, function(err) {
  			console.log(err)
		})
		.catch(console.error)
   }))



	// collection.find({zone: "one"}).sort({franklinID: 1}).toArray(function(err, result) {
	// 	if (err) throw err;
	// 	// console.log(result);

	// 	res.render('app.ejs', {ejsData: result})
	// 	// db.close();
	// })

	// console.log(new ObjectID())
})

