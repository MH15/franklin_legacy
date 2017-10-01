// Load the stuff we need
const express = require('express')
const engine = require('ejs-locals')
const mongoose = require('mongoose')
const promise = require('mpromise')

const config = require('./app/config')

// Connect to database
mongoose.Promise = promise

mongoose.connect(config.db, { useMongoClient: true }, (error) => {
  throw error
})

// Create the application
var app = express()

// Setup the app settings
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', './app/views')

// Add some static routes
app.use(express.static('public'))

// Add our controllers
app.use(require('./app/controllers/base'))

// Start the application
app.listen(6060, () => {
  console.log('Listening on port :6060')
})
