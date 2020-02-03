const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const checkJwt = require('./api/middleware/checkJwt')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

//https://i.redd.it/nu8nm8h1bvc41.jpg
const limiter = rateLimit({
  windowMs:  15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

// Create a new Express app
const app = express()
app.use(helmet())
app.use(rateLimit(limiter))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/build')))

/*
TODO:
- Install helmet, rate-limit etc for extra protection
- add morgan for logging
- mongoose and other connections to mongoDB
- add CRUD for a basic tiem
- add snippets of fun
*/

// connect to the db
const uri = '' // add atlas URI here
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const connection = mongoose.connection

connection.once('open', () => {
  console.log('connected to the database successfuly!')
})

// Define an endpoint that must be called with an access token
app.get('/api/external', checkJwt, (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!'
  })
})

// Define a router for each component
const componentRouter = require('./api/components/component/component')
app.use('/api/component', componentRouter)

app.get('*', function (req, res) {
  res.redirect('/')
})

// Start the app
app.listen(process.env.PORT || 3000, () => console.log('API listening on 3000'))
