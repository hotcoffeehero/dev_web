const express = require('express')
const connectDB = require('./config/db')
//Initialize the app variable with Express
const app = express()

//connecting to the database
connectDB()

app.get('/', (req, res) => res.send('API Running...'))

//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`The Matrix has you on ${PORT}`))
