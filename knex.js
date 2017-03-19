'use strict';

const environment = process.env.NODE_ENV || 'development';

//knexfile.js returns an object. environment provides the right key to use
const knexConfig = require('./knexfile')[environment];

//requiring the actual knex module, passing knexConfig as an argument
const knex = require('knex')(knexConfig);

module.exports = knex;
