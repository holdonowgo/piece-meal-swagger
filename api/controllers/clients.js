

const knex = require("../db/knex");
const bookshelf = require("../db/bookshelf");
const jwt = require("jsonwebtoken");
// const Client = require('../models/client.js').Client;

module.exports = {
  getClient,
  getClients,
  addClient,
  getRestrictions,
  addRestriction,
  deleteRestriction,
  crossCheckRecipe,
  verifyIngredient,
  getUsersSearchResponse
};

const bcrypt = require("bcrypt-as-promised");
const humps = require("humps");
const ev = require("express-validation");
// const validations = require("../validations/users");

// add comments above each function describing what they do.
function addClient(req, res, next) {
  knex("clients")
        .first().where("email", req.swagger.params.client.value.email)
        .then((result) => {
          if (result) {
            res.status(400).json("Client already exists!");
          } else {
            return bcrypt.hash(req.swagger.params.client.value.password, 12);
          }
        })
        .then((hashed_password) => {
          const client = {
            first_name: req.swagger.params.client.value.first_name,
            last_name: req.swagger.params.client.value.last_name,
            email: req.swagger.params.client.value.email,
            hashed_password // youreawizard
          };

          return knex("clients")
                .insert(client, "*").returning("*")
                .then((insertedClient) => {
                  delete insertedClient[0].created_at;
                  delete insertedClient[0].updated_at;
                  delete insertedClient[0].hashed_password;

                    // return res.status(200).json(insertedClient[0]);
                  return insertedClient[0];
                })
                .catch((err) => {
                  res.sendStatus(500);
                });
        })
        .then((client) => {
          console.log(client);
          const claim = {
            userId: client.id
          };

          const token = jwt.sign(claim, process.env.JWT_KEY, {
            expiresIn: "7 days"
          });

          client.token = token;

          delete client.hashed_password;
          delete client.created_at;
          delete client.updated_at;

          res.set("Token", token);
          res.set("Content-Type", "application/json");
          res.status(200).json(client);
        })
        .catch((err) => {
          next(err);
        });
        // take out code that you aren't using.
}

// add comments above each function describing what they do.
function crossCheckRecipe(req, res) {
  const promises = [];
        // take out code that you aren't using.
  promises.push(knex("ingredients")
        .select("client_restriction.ingredient_id", "ingredients.name")
        .join("client_restriction", "ingredients.id", "client_restriction.ingredient_id")
        .where("client_restriction.client_id", req.swagger.params.user_id.value)
    );
// take out code that you aren't using.
  promises.push(knex
        .select("ingredients.id", "ingredients.name")
        .from("ingredients")
        .join("recipe_ingredients", function () {
          this
                .on("recipe_ingredients.ingredient_id", "ingredients.id")
                .andOn("recipe_ingredients.recipe_id", req.swagger.params.recipe_id.value);
        }));
  Promise.all(promises)
        .then((results) => {
          const restrictions = results[0];
          const recipe_ingredients = results[1];
          const result = {
            is_safe: true,
            forbidden: []
          };

          for (const restriction of restrictions) {
            const found = recipe_ingredients.some(ingredient => ingredient.id === restriction.ingredient_id);
            if (found) {
              result.forbidden.push(restriction);
              result.is_safe = false;
            }
          }

          return res.json(result);
        });
}

// add comments above each function describing what they do.
function verifyIngredient(req, res) {
  knex("client_restriction")
        .where("client_id", req.swagger.params.user_id.value)
        .where("ingredient_id", req.swagger.params.ingredient_id.value)
        .then((results) => {
          if (results.length === 0) {
            return res.json({
              safe: true
            });
          }
          return knex("ingredients")
                .join("ingredient_alternatives", "ingredient_alternatives.alt_ingredient_id", "ingredients.id")
                .select("ingredients.id", "name")
                .where("ingredient_alternatives.ingredient_id", req.swagger.params.ingredient_id.value);
        }).then(alternatives => res.json({
          safe: false,
          alternatives
        }));
}

// add comments above each function describing what they do.
function getClients(req, res) {
    // To list clients

  const promises = [];

  promises.push(knex("clients").select("id", "first_name", "last_name", "email", "is_super_user"));
  promises.push(knex("client_recipes")
        .join("recipes", "recipes.id", "=", "client_recipes.recipe_id")
        .select("client_recipes.client_id", "recipes.*"));
  Promise.all(promises)
        .then((results) => {
          const clients = results[0];
          const recipes = results[1];

          for (const client of clients) {
            const r = recipes.filter(recipe => recipe.client_id === client.id).map(recipe => ({
              id: recipe.id,
              instructions: recipe.instructions,
              name: recipe.name
            })).sort((a, b) => a.id - b.id);

            client.recipes = r;
          }

          return res.json({
            clients
          });
        });
}

// add comments above each function describing what they do.
function getClient(req, res) {
    // To list clients

  const promises = [];
  promises.push(
        knex("clients")
        .select("id", "first_name", "last_name", "email", "is_super_user")
        .first()
        .where("id", req.swagger.params.user_id.value)
    );
  promises.push(
        knex("client_recipes")
        .join("recipes", "recipes.id", "=", "client_recipes.recipe_id")
        .select("client_recipes.client_id", "recipes.*")
        .where("client_recipes.client_id", req.swagger.params.user_id.value)
    );

  Promise.all(promises)
        .then((results) => {
          const client = results[0];
          const recipes = results[1];

          if (!client) {
            res.set("Content-Type", "application/json");
            return res.sendStatus(404);
          }

          client.recipes = recipes.map(recipe => ({
            id: recipe.id,
            name: recipe.name,
            instructions: recipe.instructions
          })).sort();

          return res.json(client);
        })
        .catch(err => res.sendStatus(500));
}

// add comments above each function describing what they do.
function getRestrictions(req, res) {
  knex("ingredients")
        .join("client_restriction", "ingredients.id", "ingredient_id")
        .where("client_id", req.swagger.params.user_id.value)
        .then((results) => {
          const result = [];
          for (let i = 0; i < results.length; i++) {
            result.push({
              id: results[i].ingredient_id,
              name: results[i].name
            });
          }
          return res.json({
            ingredients: result
          });
        });
}

// add comments above each function describing what they do.
function addRestriction(req, res) {
  const user_id = req.swagger.params.user_id.value;
  const ingredient_id = req.swagger.params.ingredient.value.ingredient_id;
  return knex.insert({
    client_id: user_id,
    ingredient_id
  })
        .into("client_restriction")
        .then(() => res.json({
          success: 1,
          description: "Restriction has been added"
        }));
}

// add comments above each function describing what they do.
function deleteRestriction(req, res) {
  jwt.verify(req.headers.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set("Content-Type", "application/json");
      res.status(401).send("Unauthorized");
    }
    const user_id = req.swagger.params.user_id.value;
    const ingredient_id = req.swagger.params.ingredient.value.ingredient_id;
    knex("client_restriction").where("client_id", user_id)
            .where("ingredient_id", ingredient_id).del()
            .then(() => res.json({
              success: 1,
              description: "Restriction has been deleted"
            }));
  });
}

// add comments above each function describing what they do.
function getUsersSearchResponse(req, res) {
    // To list clients
  const email = req.swagger.params.email.value;
  const first_name = req.swagger.params.first_name.value;
  const last_name = req.swagger.params.last_name.value;
  const promises = [];
    // promises.push(knex("clients").select("id"));
  promises.push(knex("clients")
        .select("id", "first_name", "last_name", "email", "is_super_user")
        .where(`clients.first_name`, `like`, `%${first_name}%`)
        .orWhere(`clients.last_name`, `like`, `%${last_name}%`)
        .orWhere(`clients.email`, `like`, `%${email}%`)
    );
  promises.push(knex("client_recipes")
        .join("recipes", "recipes.id", "=", "client_recipes.recipe_id")
        .select("client_recipes.client_id", "recipes.*"));
  Promise.all(promises)
        .then((results) => {
          const clients = results[0];
          const recipes = results[1];

          for (const client of clients) {
            const r = recipes.filter(recipe => recipe.client_id === client.id).map(recipe => ({
              id: recipe.id,
              instructions: recipe.instructions,
              name: recipe.name
            })).sort();

            client.recipes = r;
          }

          return res.json({
            clients
          });
        });
}
