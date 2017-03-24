'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
// const Client = require('../models/client.js').Client;

module.exports = {
    getClient: getClient,
    getClients: getClients,
    addClient: addClient,
    getRestrictions: getRestrictions,
    addRestriction: addRestriction,
    deleteRestriction: deleteRestriction,
    crossCheckRecipe: crossCheckRecipe,
    verifyIngredient: verifyIngredient,
    getUsersSearchResponse: getUsersSearchResponse,
}

const bcrypt = require('bcrypt-as-promised');
const humps = require('humps');
const ev = require('express-validation');
// const validations = require("../validations/users");

// YOUR CODE HERE
function addClient(req, res, next) {
    knex("clients")
        .first().where("email", req.swagger.params.client.value.email)
        .then((result) => {
            if (result) {
                res.status(400).json('Client already exists!');
            } else {
                return bcrypt.hash(req.swagger.params.client.value.password, 12);
            }
        })
        .then((hashed_password) => {
            var client = {
                first_name: req.swagger.params.client.value.first_name,
                last_name: req.swagger.params.client.value.last_name,
                email: req.swagger.params.client.value.email,
                hashed_password: hashed_password // youreawizard
            };

            knex('clients')
                .insert(client, '*')
                .then((insertedClient) => {
                    delete insertedClient[0].created_at;
                    delete insertedClient[0].updated_at;
                    delete insertedClient[0]['hashed_password'];

                    res.status(200).json(insertedClient[0]);
                })
                .catch((err) => {
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            next(err);
        });
    // bcrypt.hash(req.body.password, 12)
    //     .then((hashed_password) => {
    //         var client = {
    //             first_name: req.body.firstName,
    //             last_name: req.body.lastName,
    //             email: req.body.email,
    //             hashed_password: hashed_password // youreawizard
    //         };
    //
    //         knex('clients')
    //             .insert(client, '*')
    //             .then((insertedClient) => {
    //                 delete insertedClient[0]['hashed_password'];
    //                 // res.status(200).json(humps.camelizeKeys(insertedUser[0]));
    //                 res.status(200).json(insertedClient[0])
    //             })
    //             .catch((err) => {
    //                 res.sendStatus(500);
    //             });
    //     })
    //     .catch((err) => {
    //         next(err);
    //     });
}

function crossCheckRecipe(req, res) {
    let promises = [];
    // promises.push(knex("clients").select("id"));
    promises.push(knex("clients")
        .join('client_restriction', 'clients.id', 'client_restriction.client_id')
        .where("clients.id", req.swagger.params.user_id.value)
    );
    promises.push(knex("recipe_ingredients")
        .where("recipe_id", req.swagger.params.recipe_id.value)
    );
    Promise.all(promises)
        .then((results) => {
            let restrictions = results[0];
            let recipe_ingredient = results[1];

            let result = {
                is_safe: true,
                forbidden: []
            };

            for (let restriction of restrictions) {
                let found = recipe_ingredient.some(function(ingredient) {
                    return ingredient.id === restriction.id;
                });
                if (found) {
                    result.forbidden.push(restriction.ingredient_id);
                    result.is_safe = false;
                }
            }

            return res.json(result);
        });
}

function verifyIngredient(req, res) {
  knex("client_restriction")
    .where('client_id', req.swagger.params.user_id.value)
    .where('ingredient_id', req.swagger.params.ingredient_id.value)
    .then((results) => {
      if (results.length === 0) {
        return res.json({ safe: true });
      }
      return knex("ingredients")
        .join('ingredient_alternatives', 'ingredient_alternatives.alt_ingredient_id', 'ingredients.id')
        .select("ingredients.id", "name")
        .where("ingredient_alternatives.ingredient_id", req.swagger.params.ingredient_id.value);
    }).then((alternatives) => {
      return res.json({
        safe: false,
        alternatives: alternatives
      });
    });
}

function getClients(req, res) {
    // To list clients

    let promises = [];
    // promises.push(knex("clients").select("id"));
    promises.push(knex("clients").select("id", "first_name", "last_name", "email", "is_super_user"));
    promises.push(knex("client_recipes")
        .join('recipes', 'recipes.id', '=', 'client_recipes.recipe_id')
        .select("client_recipes.client_id", "recipes.*"));
    Promise.all(promises)
        .then((results) => {
            let clients = results[0];
            let recipes = results[1];

            for (let client of clients) {
                let r = recipes.filter((recipe) => {
                    return recipe.client_id === client.id;
                }).map((recipe) => {
                    return {
                        id: recipe.id,
                        instructions: recipe.instructions,
                        name: recipe.name
                    };
                }).sort();

                client.recipes = r;
            }

            return res.json({
                clients: clients
            });
        });
}

function getClient(req, res) {
    // To list clients

    let promises = [];
    promises.push(
        knex("clients")
        .select("id", "first_name", "last_name", "email", "is_super_user")
        .first()
        .where("id", req.swagger.params.user_id.value)
    );
    promises.push(
        knex("client_recipes")
        .join('recipes', 'recipes.id', '=', 'client_recipes.recipe_id')
        .select("client_recipes.client_id", "recipes.*")
        .where("client_recipes.client_id", req.swagger.params.user_id.value)
    );

    Promise.all(promises)
        .then((results) => {
            let client = results[0];
            let recipes = results[1];

            if (!client) {
                res.set('Content-Type', 'application/json')
                return res.sendStatus(404);
            }

            client["recipes"] = recipes.map((recipe) => {
                return {
                    id: recipe.id,
                    name: recipe.name,
                    instructions: recipe.instructions
                };
            }).sort();

            return res.json(client);
        })
        .catch((err) => {
            return res.sendStatus(500);
        });
}

function getRestrictions(req, res) {
    knex('ingredients')
        .join('client_restriction', 'ingredients.id', 'ingredient_id')
        .where('client_id', req.swagger.params.user_id.value)
        .then((results) => {
            let result = [];
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

function addRestriction(req, res) {
    let user_id = req.swagger.params.user_id.value;
    let ingredient_id = req.swagger.params.ingredient.value.ingredient_id;
    return knex.insert({
            'client_id': user_id,
            'ingredient_id': ingredient_id
        })
        .into('client_restriction')
        .then(() => {
            return res.json({
                success: 1,
                description: 'Restriction has been added'
            });
        });
}

function deleteRestriction(req, res) {
    let user_id = req.swagger.params.user_id.value;
    let ingredient_id = req.swagger.params.ingredient.value.ingredient_id;
    knex('client_restriction').where('client_id', user_id)
        .where('ingredient_id', ingredient_id).del()
        .then(() => {
            return res.json({
                success: 1,
                description: 'Restriction has been deleted'
            });
        });
}

function getUsersSearchResponse(req, res) {
    // To list clients
    let email = req.swagger.params.email.value;
    let first_name = req.swagger.params.first_name.value;
    let last_name = req.swagger.params.last_name.value;
    let promises = [];
    // promises.push(knex("clients").select("id"));
    promises.push(knex("clients")
        .select("id", "first_name", "last_name", "email", "is_super_user")
        .where(`clients.first_name`, `like`, `%${first_name}%`)
        .orWhere(`clients.last_name`, `like`, `%${last_name}%`)
        .orWhere(`clients.email`, `like`, `%${email}%`)
    );
    promises.push(knex("client_recipes")
        .join('recipes', 'recipes.id', '=', 'client_recipes.recipe_id')
        .select("client_recipes.client_id", "recipes.*"));
    Promise.all(promises)
        .then((results) => {
            let clients = results[0];
            let recipes = results[1];

            for (let client of clients) {
                let r = recipes.filter((recipe) => {
                    return recipe.client_id === client.id;
                }).map((recipe) => {
                    return {
                        id: recipe.id,
                        instructions: recipe.instructions,
                        name: recipe.name
                    };
                }).sort();

                client.recipes = r;
            }

            return res.json({
                clients: clients
            });
        });
}
