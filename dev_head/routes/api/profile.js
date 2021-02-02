const express = require('express')
const router = express.Router()
const authWare = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
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

//ROUTE:    POST api/profile
//DESC:     Create or Update Profile
//ACCESS:   Private
router.post(
  '/',
  [
    authWare,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are a must').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body

    //Build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }

    //Build Social Media Object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (instagram) profileFields.social.instagram = instagram
    if (linkedin) profileFields.social.linkedin = linkedin

    try {
      let profile = await Profile.findOne({ user: req.user.id })
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        return res.json(profile)
      }
      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  }
)

//ROUTE:    GET api/profile
//DESC:     Get all profiles
//ACCESS:   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name, avatar'])
    res.json(profiles)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

//ROUTE:    GET api/profile/user/:user_id
//DESC:     Get profile by user ID
//ACCESS:   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name, avatar'])

    if (!profile) return res.status(400).json({ message: 'Profile Not Found.' })

    res.json(profile)
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Profile Not Found.' })
    }
    res.status(500).send('Server Error')
  }
})

module.exports = router
