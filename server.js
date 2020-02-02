const express = require('express')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const path = require('path')

// Create a new Express app
const app = express()

// Set up Auth0 configuration
const authConfig = {
  domain: 'dev-ojrc28lz.auth0.com',
  audience: 'https://api.mysite.com'
}

// Define middleware that validates incoming bearer tokens
// using JWKS from dev-ojrc28lz.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256']
})

app.use(express.static(path.join(__dirname, '/build')))

/*
TODO:
- Install helmet, rate-limit etc for extra protection
- add morgan for logging
- mongoose and other connections to mongoDB
- add CRUD for a basic tiem
- add snippets of fun
*/

// Define an endpoint that must be called with an access token
app.get('/api/external', checkJwt, (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!'
  })
})

app.get('*', function (req, res) {
  res.redirect('/')
})

// Start the app
app.listen(process.env.PORT || 3000, () => console.log('API listening on 3000'))
