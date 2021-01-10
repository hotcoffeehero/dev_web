const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
//import the user from the mongoose model
const User = require('../../models/User')

// @route   POST api/users
// @desc    Register users
// access   Public
router.post(
  '/',
  [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please Include a Valid Email').isEmail(),
    check('password', 'Enter a Password; 6+ Characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      // Check if a user exists
      let user = await User.findOne({ email })
      if (user) {
        res.status(400).json({ errors: [{ msg: 'User Already Exists' }] })
      }
      // Get User's gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      user = new User({
        name,
        email,
        avatar,
        password,
      })
      // Encrypt the password with bcrypt
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()
      // Return JSON webtoke
      res.send('User Registered.')
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  }
)

module.exports = router
