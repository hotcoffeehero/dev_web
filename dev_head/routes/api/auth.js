const express = require('express')
const router = express.Router()
const bycrypt = require('bcryptjs')
const authWare = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
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

//ROUTE:    POST api/auth
//DESC:     Authenticate user & get token
//ACCESS:   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })

      //Check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentials' }] })
      }

      const isMatch = await bycrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invalid Credentials' }] })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error
          res.json({ token })
        }
      )
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  }
)

module.exports = router
