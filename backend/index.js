
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();//we are calling db which we connected in db.js

const app = express()
const port = 5000

//when we want to use req.json this app.use(express.json) middle ware should use
app.use(cors())
app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost: ${port}`)
})

