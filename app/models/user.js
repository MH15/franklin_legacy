const mongoose = require('mongoose')
const schema = mongoose.Schema

var userSchema = new schema({
  username: String,
  fullname: String,
  password: String,
  created: { type: Date, default: Date.now }
})

module.exports = mongoose.Model('user', userSchema)
