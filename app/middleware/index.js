const authRequired = require('./auth')
const guestRequired = require('./guest')

module.exports = {
  auth: authRequired,
  guest: guestRequired
}
