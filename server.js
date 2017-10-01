// Load the stuff we need
const express = require('express')
const engine = require('ejs-locals')
const session = require('express-session')
const bodyParser = require('body-parser')

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

// Use some stuff we need
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true,
  name: 'franklin.sid'
}))

app.use(bodyParser.urlencoded({extended: true, limit: config.maxBody}))
app.use(bodyParser.json())

// Add some static routes
app.use(express.static('public'))

// Add our controllers
app.use(require('./app/controllers/base'))
app.use(require('./app/controllers/auth'))

// If we can't find the requested data
app.use(function (req, res, next) {
  res.status(404).render('errors/404', {
    title: 'Not Found'
  })
})

// If the server has an error
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Start the application
app.listen(6060, () => {
  console.log('Listening on port :6060')
})
