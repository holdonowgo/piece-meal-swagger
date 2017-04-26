'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
const jwt = require('jsonwebtoken');
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

            return knex('clients')
                .insert(client, '*').returning('*')
                .then((insertedClient) => {
                    delete insertedClient[0].created_at;
                    delete insertedClient[0].updated_at;
                    delete insertedClient[0]['hashed_password'];

                    // return res.status(200).json(insertedClient[0]);
                    return insertedClient[0];
                })
                .catch((err) => {
                    res.sendStatus(500);
                });
        })
        .then((client) => {
            const claim = {
                userId: client.id
            };

            const token = jwt.sign(claim, process.env.JWT_KEY, {
                expiresIn: '7 days'
            });

            client.token = token;

            delete client.hashed_password;
            delete client.created_at;
            delete client.updated_at;

            res.set('Token', token);
            res.set('Content-Type', 'application/json');
            res.status(200).json(client);
        })
        .catch((err) => {
            next(err);
        });
}

function crossCheckRecipe(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }
        let promises = [];

        promises.push(knex("ingredients")
            .select('client_restrictions.ingredient_id', 'ingredients.name', 'ingredients.description')
            .join('client_restrictions', 'ingredients.id', 'client_restrictions.ingredient_id')
            .where("client_restrictions.client_id", req.swagger.params.user_id.value)
        );

        promises.push(knex
            .select('ingredients.id', 'ingredients.name', 'ingredients.description')
            .from('ingredients')
            .join('recipe_ingredients', function() {
                this
                    .on('recipe_ingredients.ingredient_id', 'ingredients.id')
                    .andOn('recipe_ingredients.recipe_id', req.swagger.params.recipe_id.value);
            }));
        Promise.all(promises)
            .then((results) => {
                let restrictions = results[0];
                let recipe_ingredients = results[1];
                let result = {
                    is_safe: true,
                    forbidden: []
                };

                for (let restriction of restrictions) {
                    let found = recipe_ingredients.some(function(ingredient) {
                        return ingredient.id === restriction.ingredient_id;
                    });
                    if (found) {
                        result.forbidden.push(restriction);
                        result.is_safe = false;
                    }
                }

                return res.json(result);
            });
      });
}

function verifyIngredient(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }
        knex("client_restrictions")
            .where('client_id', req.swagger.params.user_id.value)
            .where('ingredient_id', req.swagger.params.ingredient_id.value)
            .then((results) => {
                if (results.length === 0) {
                    return res.json({
                        safe: true
                    });
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
      });
}

function getClients(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }
        // To list clients

        let promises = [];

        promises.push(knex("clients").select("id", "first_name", "last_name", "email", "is_super_user"));
        promises.push(knex("client_recipes")
            .join('recipes', 'recipes.id', '=', 'client_recipes.recipe_id')
            .select("client_recipes.client_id", "recipes.*"));
        promises.push(knex("recipe_steps")
            .join('recipes', 'recipes.id', '=', 'recipe_steps.recipe_id')
            .select("recipe_steps.*"));
        Promise.all(promises)
            .then((results) => {
                let clients = results[0];
                let recipes = results[1];
                let recipe_steps = results[2];

                for (let client of clients) {
                    let r = recipes.filter((recipe) => {
                        return recipe.client_id === client.id;
                    }).map((recipe) => {
                      recipe.instructions = recipe_steps.filter((step) => {
                        return step.recipe_id === recipe.id;
                      }).map((step) => {
                        return {
                          step_number: step.step_number,
                          instructions: step.instructions
                        }
                      }).sort((a, b) => {
                          return a.step_number - b.step_number;
                      });
                      delete recipe.client_id;
                      return recipe;
                        // return {
                        //     id: recipe.id,
                        //     instructions:
                        //       recipe_steps.filter((step) => {
                        //         return step.recipe_id === recipe.id;
                        //       }).map((step) => {
                        //         return {
                        //           step_number: step.step_number,
                        //           instructions: step.instructions
                        //         }
                        //       }).sort((a, b) => {
                        //           return a.step_number - b.step_number;
                        //       }), // steps,
                        //     name: recipe.name,
                        //     description: recipe.description
                        // };
                    }).sort((a, b) => {
                        return a.id - b.id;
                    });

                    client.recipes = r;
                }

                return res.json({
                    clients: clients
                });
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
    promises.push(knex("recipe_steps")
        .join('recipes', 'recipes.id', '=', 'recipe_steps.recipe_id')
        .select("recipe_steps.*")
      );
    promises.push(
        knex("client_restrictions")
        .join('ingredients', 'ingredients.id', 'client_restrictions.ingredient_id')
        .select("client_restrictions.client_id", "ingredients.*")
        .where("client_restrictions.client_id", req.swagger.params.user_id.value)
    );

    Promise.all(promises)
        .then((results) => {
            let client = results[0];
            let recipes = results[1];
            let instructions = results[2];
            let restrictions = results[3];

            if (!client) {
                res.set('Content-Type', 'application/json')
                return res.sendStatus(404);
            }

            client["recipes"] = recipes.map((recipe) => {
                return {
                    id: recipe.id,
                    name: recipe.name,
                    instructions: instructions.filter((step) => {
                      return step.recipe_id === recipe.id;
                    }) // recipe.instructions
                };
            }).sort();

            client.restrictions = restrictions.map((restriction) => {
                return {
                    id: restriction.id,
                    name: restriction.name,
                    description: restriction.description
                };
            }).sort((a, b) => {
              var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
            });

            return res.json(client);
        })
        .catch((err) => {
            return res.sendStatus(500);
        });
}

function getRestrictions(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }
        let promises = [];

        promises.push(knex("ingredient_tags").select("ingredient_id", "tag_text"));

        promises.push(knex('ingredients')
            .select('ingredients.id', 'ingredients.name', 'ingredients.description')
            .join('client_restrictions', 'ingredients.id', 'ingredient_id')
            .where('client_id', req.swagger.params.user_id.value));

        Promise.all(promises)
          .then((results) => {
            let tags = results[0];
            let ingredients = results[1];

            for(let ingredient of ingredients) {
              ingredient.tags =
              tags.filter((tag) => {
                return tag.ingredient_id === ingredient.id;
              })
              .map((tag) => {
                return tag.tag_text;
              })
              .sort();
            }

            return res.json({
                ingredients: ingredients.sort((a, b) => {return a.id - b.id})
            });
          });
    });
}

function addRestriction(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }
        let user_id = req.swagger.params.user_id.value;
        let ingredient_id = req.swagger.params.ingredient.value.ingredient_id;
        return knex.insert({
                'client_id': user_id,
                'ingredient_id': ingredient_id
            })
            .into('client_restrictions')
            .then(() => {
                return res.json({
                    success: 1,
                    description: 'Restriction has been added'
                });
            });
      });
}

function deleteRestriction(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }
        let user_id = req.swagger.params.user_id.value;
        let ingredient_id = req.swagger.params.ingredient.value.ingredient_id;
        knex('client_restrictions').where('client_id', user_id)
            .where('ingredient_id', ingredient_id).del()
            .then(() => {
                return res.json({
                    success: 1,
                    description: 'Restriction has been deleted'
                });
            });
    });
}

function getUsersSearchResponse(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }
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
            .select("client_recipes.client_id", "recipes.*")
          );
        promises.push(knex("recipe_steps")
            .join('recipes', 'recipes.id', '=', 'recipe_steps.recipe_id')
            .select("recipe_steps.*")
          );
        Promise.all(promises)
            .then((results) => {
                let clients = results[0];
                let recipes = results[1];
                let instructions = results[2];

                for (let client of clients) {
                    let r = recipes.filter((recipe) => {
                        return recipe.client_id === client.id;
                    }).map((recipe) => {
                        return {
                            id: recipe.id,
                            instructions: instructions.filter((step) => {
                              return step.recipe_id === recipe.id
                            }), // recipe.instructions,
                            name: recipe.name
                        };
                    }).sort();

                    client.recipes = r;
                }

                return res.json({
                    clients: clients
                });
            });
      });
}
