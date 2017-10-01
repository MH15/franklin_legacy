const authRequired = require('./auth')
const nothingRequired = require('./all')

module.exports = {
  auth: authRequired,
  all: nothingRequired
}
