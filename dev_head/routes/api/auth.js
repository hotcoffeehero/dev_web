const express = require('express')
const router = express.Router()
const authWare = require('../../middleware/auth')
const User = require('../../models/User')

//ROUTE:    GET api/auth
//DESC:     Test Route
//ACCESS:   Public
router.get('/', authWare, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
