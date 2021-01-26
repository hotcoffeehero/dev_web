const express = require('express')
const router = express.Router()

//ROUTE:    GET api/posts
//DESC:     Test Route
//ACCESS:   Public
router.get('/', (req, res) => res.send('Posts Route'))

module.exports = router
