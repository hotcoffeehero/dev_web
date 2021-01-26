const express = require('express')
const router = express.Router()

//ROUTE:    GET api/profile
//DESC:     Test Route
//ACCESS:   Public
router.get('/', (req, res) => res.send('Profile Route'))

module.exports = router
