const express = require('express')
const connectDB = require('./config/db')
const path = require('path')
const app = express()
connectDB()

//Init Middleware
app.use(express.json({ extended: false }))

//The Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server go on ${PORT}`))
