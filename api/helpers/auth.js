const bcrypt = require('bcrypt-nodejs-as-promised');
const jwt = require('jsonwebtoken');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let app = require('express')();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

function verifyLoggedIn(req, res, next) {
  if (req.baseUrl === '/api/v1/clients' && req.method === 'POST') {
      next();
  } else if (req.baseUrl === '/api/v1/recipes' && req.method === 'GET') {
    next();
  } else if (req.baseUrl === '/api/v1/ingredients' && req.method === 'GET') {
    next();
  } else if (req.baseUrl === '/api/v1/search' && req.method === 'GET') {
    next();
  } else {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.status(401).json('Not Logged In')
        } else {
            next()
        }
    })
  }
}

module.exports = {
    verifyLoggedIn: verifyLoggedIn
}
