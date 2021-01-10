const express = require('express')
const connectDB = require('./config/db')
//Initialize the app variable with Express
const app = express()

//connecting to the database
connectDB()

app.get('/', (req, res) => res.send('API Running...'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`The Matrix has you on ${PORT}`))
