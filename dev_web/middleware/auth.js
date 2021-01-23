const jwt = require('jsonwebtoken')
const config = require('config')

const authWare = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).json({ msg: 'No Token. No Entry.' })
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid.' })
  }
}

module.exports = authWare
