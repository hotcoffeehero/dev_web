const express = require('express')
const router = express.Router()

//ROUTE:    GET api/auth
//DESC:     Test Route
//ACCESS:   Public
router.get('/', (req, res) => res.send('Auth Route'))

module.exports = router
