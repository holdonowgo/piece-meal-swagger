

const knex = require("../../db/knex"); // moded all the database connection items into a directory.
const bookshelf = require("../../db/bookshelf");
const bcrypt = require("bcrypt-as-promised");
const jwt = require("jsonwebtoken");

module.exports = {
  postToken
};

// take out code you're not using.

// add comments above each function describing what they do.
function postToken(req, res) {
  knex("clients")
        .where("email", req.swagger.params.credentials.value.email)
        .first()
        .then(client => bcrypt.compare(
                req.swagger.params.credentials.value.password,
                client.hashed_password
            ))
        .then((passwordMatched) => {
          if (!passwordMatched) {
            res.status(400).json({
              message: "Bad email or password"
            });
            return;
          }
          return knex("clients")
                .where("email", req.swagger.params.credentials.value.email)
                .first();
        })
        .then((client) => {
          const claim = {
            userId: client.id
          };

          const token = jwt.sign(claim, process.env.JWT_KEY, {
            expiresIn: "7 days"
          });

          client.token = token;

          delete client.first_name;
          delete client.last_name;
          delete client.hashed_password;
          delete client.created_at;
          delete client.updated_at;

          res.set("Token", token);
          res.set("Content-Type", "application/json");
          res.status(200).json(client);
        })
        .catch((err) => {
          res.status(400).json({
            message: "Can't make token"
          });
        })
        .catch(bcrypt.MISMATCH_ERROR, () => {
          res.status(400).json({
            message: "Bad email or password"
          });
        });
}
