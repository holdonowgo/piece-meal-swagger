'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
const bcrypt = require('bcrypt-nodejs-as-promised');
const jwt = require('jsonwebtoken');
const Client = require('../models/client.js').Client;
const Clients = require('../models/client.js').Clients;

const clientSecret = process.env.CLIENT_SECRET;

module.exports = {
    postToken,
    postTokenOAuth
}

const finishLogin = (client, res) => {
  new Client({id: client.id}).save({
    last_login_at: knex.raw('now()')
  }, {patch: true}).then((model) => {
    const claim = {
        userId: client.id
    };

    const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '7 days'
    });

    client.token = token;

    delete client.first_name;
    delete client.last_name;
    delete client.hashed_password;
    delete client.created_at;
    delete client.updated_at;

    res.set('Token', token);
    res.set('Content-Type', 'application/json');
    res.status(200).json(client);
  });
}

function postTokenOAuth(req, res) {
  const idToken = req.swagger.params.credentials.value.idToken;
  jwt.verify(idToken, clientSecret, (err, payload) => {
    if (err) {
        res.set('Content-Type', 'application/json');
        res.status(401).send('Unauthorized');
    } else {
        const full_name = payload.name || "John Doe";
        const [first_name, ...last_name_parts] = full_name.split(" ");
        let last_name = last_name_parts.join(" ");
        // console.log("decoded", decoded.email);
        knex('clients')
          .where('email', payload.email)
          .first()
          .then((client) => {
            if (client === undefined) {
              // no account yet, make an account
              let client = {
                  first_name: first_name,
                  last_name: last_name,
                  email: payload.email,
                  hashed_password: ""
              };
              return knex('clients').insert(client, '*').returning('*')
                .then((insertedRows) => {
                  return insertedRows[0];
                });
            }
            return client;
          })
          .then((client) => {
            return finishLogin(client, res);
          })
          .catch((err) => {
              res.status(400).json({
                  message: "Can't authenticate via OAuth."
              });
          })
      }
  });
}

function postToken(req, res) {
  knex('clients')
      .where('email', req.swagger.params.credentials.value.email)
      .first()
      .then((client) => {
          return bcrypt.compare(
              req.swagger.params.credentials.value.password,
              client.hashed_password
          );
      })
      .then((passwordMatched) => {
          if (!passwordMatched) {
              res.status(400).json({
                  message: 'Bad email or password'
              });
              return;
          }
          return knex('clients')
              .where('email', req.swagger.params.credentials.value.email)
              .first();
      })
      .then((client) => {
        return finishLogin(client, res);
      })
      .catch((err) => {
          res.status(500).json({
              message: "Can't make token"
          });
      })
      .catch(bcrypt.MISMATCH_ERROR, () => {
          res.status(400).json({
              message: 'Bad email or password'
          });
      });
}
