const express = require('express')
//Initialize the app variable with Express
const app = express()

app.get('/', (req, res) => res.send('API Running...'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`The Matrix has you on ${PORT}`))
