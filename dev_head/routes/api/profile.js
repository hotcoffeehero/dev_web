const express = require('express')
const router = express.Router()
const authWare = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

//ROUTE:    GET api/profile/me
//DESC:     Get current user's profile
//ACCESS:   Private
router.get('/me', authWare, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res
        .status(400)
        .json({ message: 'These Credentials are no good. ' })
    }
    res.json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
