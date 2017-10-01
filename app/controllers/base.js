const express = require('express')
const middleware = require('../middleware')
var router = express.Router()

router.get('/', middleware.all, (req, res) => {
  res.render('base/index', {
    title: 'Hello World'
  })
})

module.exports = router
