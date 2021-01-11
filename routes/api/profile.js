const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')

//=====================================================================
// @route   GET api/profile/me
// @desc    Get logged in user's profile
// access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    //check if there's no profile
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user.' })
    }

    //If there is a profile, return it.
    res.json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

// ====================================================================
// @route   POST api/profile
// @desc    Create or update user profile
// access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
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

    //Build Profile Object to insert into DB
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
    // console.log(profileFields.skills)
    // res.send('Hello')

    //Build Social media presence object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    //
    try {
      let profile = await Profile.findOne({ user: req.user.id })

      //If a profile already exists, show it
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        return res.json(profile)
      }

      //Otherwise, create it
      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (error) {}
  }
)

// ====================================================================
// @route   GET api/profile
// @desc    Get all profiles
// access   public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

//=====================================================================
// @route   GET api/profile/user/:user_id
// @desc    Get a profile by its id
// access   public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])
    res.json(profile)
    //Check to make sure such a profile exists
    if (!profile) return res.status(400).json({ msg: 'No such profile' })
  } catch (error) {
    console.error(error.message)
    if (error.kind == ObjectId) {
      return res.status(400).json({ msg: 'No such profile' })
    }
    res.status(500).send('Server Error')
  }
})

//=====================================================================
// @route   DELETE api/profile
// @desc    delete a user, profile and posts.
// access   private
router.delete('/', auth, async (req, res) => {
  try {
    //Remove user's posts

    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    await User.findOneAndRemove({ _id: req.user.id })
    res.json({ message: "It's dust in the wind..." })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
