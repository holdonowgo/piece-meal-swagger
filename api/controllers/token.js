'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

module.exports = {
    postToken,
    postTokenOAuth
}

// function postToken(req, res) {
//     if (!req.cookies.token) {
//         return res.status(200).json(false);
//     }
//     jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
//         if (err) {
//             //unauthorized
//             return res.status(200).json(false);
//         }
//         //the payload is the claim that we sent the client. In this case {clientId}
//         //if it is present, the client is authorized. Do what you need to with clientId
//         if (payload.userId) {
//             return res.status(200).json(true);
//         } else {
//             return res.status(200).json(false);
//         }
//     });
// }

const finishLogin = (client, res) => {
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
}

function postTokenOAuth(req, res) {
  const idToken = req.swagger.params.credentials.value.idToken;
  console.log("post token ouath", idToken);
  //jwt.verify(idToken, process.env.AUTH0_JWT_KEY, (err, payload) => {
  // if (err) {
  //     res.set('Content-Type', 'application/json');
  //     res.status(401).send('Unauthorized');
  // }
  const decoded = jwt.decode(idToken);
  console.log("decoded", decoded.email);
  knex('clients')
      .where('email', decoded.email)
      .first()
      .then((client) => {
        if (client === undefined) {
          // no account yet, make an account
          let client = {
              first_name: "tmp first name",
              last_name: "tmp last name",
              email: decoded.email,
              hashed_password: ""
          };
          console.log("inserting new client");
          return knex('clients').insert(client, '*').returning('*');
        }
        return client;
      }).then((client) => {
        console.log("found client!", client)
        return finishLogin(client, res);
      })
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
            res.status(400).json({
                message: "Can't make token"
            });
        })
        .catch(bcrypt.MISMATCH_ERROR, () => {
            res.status(400).json({
                message: 'Bad email or password'
            });
        });
}
