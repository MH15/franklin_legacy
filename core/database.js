// database.js
// ========
var MongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	ObjectID = require('mongodb').ObjectID
var express = require('express'),
	router = express.Router(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session');



// init MongoDB
var db, username, password, collection, url
username = "MH15"
password = "MHall123"
collection = "franklin-db"
url = `mongodb://${username}:${password}@ds161901.mlab.com:61901/${collection}`


let connectPromise = new Promise((resolve, reject) => {
	MongoClient.connect(url, (err, database) => {
		if (err) {
			reject(Error(err))
		} else {
			assert.equal(null, err);
			console.log("PageDB ✓".good);
			db = database

			resolve(db)
		}
	})
})

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


module.exports = {
	connectPromise: connectPromise,
	getPages: getPages

}



// MongoClient2.connect(`mongodb://${username}:${password}@ds161901.mlab.com:61901/${collection}`)
// .then(function (db) { // <- db as first argument
// 	console.log(db)
// })
// .catch(function (err) {
// 	throw err;
// })

// app.listen(6060, () => {
// 	console.log('listening on 6060')
// })
