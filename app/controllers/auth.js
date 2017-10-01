const express = require('express')
const middleware = require('../middleware')
var router = express.Router()

router.get('/signin', middleware.guest, (req, res) => {
  res.render('auth/signin', {
    title: 'Signin'
  })
})

router.post('/signin', middleware.guest, (req, res) => {
  console.log(req.body)

  res.redirect('/')
})

module.exports = router
