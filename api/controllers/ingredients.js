'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
const Ingredient = require('../models/ingredient.js').Ingredient;
const Ingredients = require('../models/ingredient.js').Ingredients;
const IngredientTag = require('../models/ingredient.js').IngredientTag;
const IngredientTags = require('../models/ingredient.js').IngredientTags;
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const url = require('url');

module.exports = {
    getIngredient: getIngredient,
    addIngredient: addIngredient,
    updateIngredient: updateIngredient,
    getIngredientsList: getIngredientsList,
    deleteIngredient: deleteIngredient,
    searchIngredients: searchIngredients,
    getIngredientAlternatives: getIngredientAlternatives,
    addIngredientAlternatives: addIngredientAlternatives,
    getPieDataSet: getPieDataSet
};

function updateIngredient(req, res, next) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }

        let id = req.swagger.params.id.value;
        let name = req.swagger.params.ingredient.value.name;
        let description = req.swagger.params.ingredient.value.description;
        let tags = req.swagger.params.ingredient.value.tags;
        let image_url = req.swagger.params.ingredient.value.image_url;

        Ingredient.forge({
            id: req.swagger.params.id.value
          })
          .fetch()
          .then((ingredient) => {
            if(!ingredient) {
              res.status(404).json('Not Found');
            } else {
              return knex('ingredients')
                  .where('id', id)
                  .update({
                      name: name,
                      description: description,
                      image_url: image_url
                  })
                  .returning('*');
                }
              })
              .then((result) => {
                return knex('ingredient_tags').where('ingredient_id', id).del();
              })
              .then((result) => {
                let data = tags.map((tag) => {
                  return { "ingredient_id": id, "tag_text": tag };
                })
                return knex('ingredient_tags').insert(data).returning("*");
              })
              .then((result) => {
                  return getIngredient(req, res);
              });
        });
}

function deleteIngredient(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }

        knex('ingredients')
            .where('id', req.swagger.params.id.value)
            .update({
                active: false
            })
            .returning('*')
            .then((result) => {
                let ingredient = result[0];
                delete ingredient.created_at;
                delete ingredient.updated_at;
                return res.json(ingredient);
            });
      });
}

function getIngredientsList(req, res) {
    // To list ingredients
    let promises = [];
    promises.push(knex("ingredients").select("id", "name", "description", "active", "image_url").orderBy('ingredients.name'));
    promises.push(knex("ingredient_tags").select("ingredient_id", "tag_text"));
    Promise.all(promises)
        .then((results) => {
            let ingredients = results[0];
            let tags = results[1];

            for (let ingredient of ingredients) {
                let t = tags.filter((tag) => {
                    return tag.ingredient_id === ingredient.id;
                }).map((tag) => {
                    return tag.tag_text;
                }).sort();

                ingredient.tags = t;
            }

            return res.json({ ingredients: ingredients });
        });
}

function getIngredientAlternatives(req, res) {
    knex("ingredients")
        .join('ingredient_alternatives', 'ingredient_alternatives.alt_ingredient_id', 'ingredients.id')
        .select("ingredients.id", "name")
        .where("ingredient_alternatives.ingredient_id", req.swagger.params.id.value)
        .orderBy('ingredients.name')
        .then((alternatives) => {
            for (let alternative of alternatives) {
                let qstring = url.format({
                    query: {
                        app_id: process.env.EDAMAM_APP_ID,
                        app_key: process.env.EDAMAM_APP_KEY,
                        ingr: "one " + alternative.name
                    }
                });
                return fetch('https://api.edamam.com/api/nutrition-data' + qstring);
            }
        })
        .then((fetchResponse) => {
            return fetchResponse.json();
        })
        .then((fetchResponse) => {
            alternative.calories = fetchResponse.calories;
            return res.json(alternative);
        });
}

function fetchIngredient(id, res) {
  Ingredient.forge({
      id: id
    })
    .fetch({
      withRelated: ['tags', 'alternatives']
    })
    .then((ingredient) => {
      if(!ingredient) {
        res.status(404).json('Not Found');
      } else {
        let ingredientObj = ingredient.serialize();
        ingredientObj.tags = ingredientObj.tags.map((value) => {
          return value.tag_text;
        }).sort();

        ingredientObj.alternatives = ingredientObj.alternatives.map((value) => {
          return {
            id: value.id,
            name: value.name
          };
        }).sort();

        delete ingredientObj.created_at;
        delete ingredientObj.updated_at;

        let qstring = url.format({
          query: {
            app_id: process.env.EDAMAM_APP_ID,
            app_key: process.env.EDAMAM_APP_KEY,
            ingr: "one " + ingredientObj.name
          }
        });
        return fetch('https://api.edamam.com/api/nutrition-data' + qstring)
          .then((fetchResponse) => {
            return fetchResponse.json();
          })
          .then((fetchResponse) => {
            ingredientObj.calories = fetchResponse.calories;

            return res.json(ingredientObj);
          });
        }
    });
}

function getIngredient(req, res) {
  return fetchIngredient(req.swagger.params.id.value, res);
}

function addIngredient(req, res, next) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }

        let name = req.swagger.params.ingredient.value.name;
        let description = req.swagger.params.ingredient.value.description;
        let image_url = req.swagger.params.ingredient.value.image_url;

        var id;
        knex("ingredients")
            .first().where("name", name)
            .then((result) => {
                if (result) {
                    delete result.created_at;
                    delete result.updated_at;
                    res.status(400).json({
                        message: 'Ingredient already exists!',
                        ingredient: result
                    });
                    throw new Error('Ingredient already exists!');
                } else {
                    return knex("ingredients")
                      .returning('*')
                      .insert({
                        "name": name,
                        "description": description,
                        "image_url": image_url
                      });
                }
            })
            .then((ingredient) => {
              id = ingredient[0].id;
                if (req.swagger.params.ingredient.value.tags) {
                    let promises = [];
                    for (let tag of req.swagger.params.ingredient.value.tags) {
                        promises.push(
                            knex("ingredient_tags")
                            .returning('*')
                            .insert({
                                "ingredient_id": id,
                                "tag_text": tag
                            })
                        );
                    }

                    // ingredient[0].tags = req.swagger.params.ingredient.value.tags;
                    // return ingredient[0];
                    return Promise.all(promises);
                }
            })
            .then((promises) => {
              // delete ingredient.created_at;
              // delete ingredient.updated_at;
              //
              // return res.json(ingredient);
              return fetchIngredient(id, res);
            })
            .catch((error) => {

            });
      });
}

function searchIngredients(req, res) {
    // To list clients
    let text = req.swagger.params.text.value;
    let promises = [];

    promises.push(
        knex("ingredients")
        // .select("ingredients.id", "name", "active")
        .leftJoin('ingredient_tags', 'ingredients.id', 'ingredient_tags.ingredient_id')
        .distinct("ingredients.id", "ingredients.name", "ingredients.image_url", "ingredients.active")
        .where('name', 'ilike', `%${text}%`)
        .orWhere('ingredient_tags.tag_text', 'ilike', `%${text}%`)
        .orderBy('ingredients.name')
    );
    promises.push(knex("ingredient_tags").select("ingredient_id", "tag_text"));
    Promise.all(promises)
        .then((results) => {
            let ingredients = results[0];
            let tags = results[1];

            for (let ingredient of ingredients) {
                let t = tags.filter((tag) => {
                    return tag.ingredient_id === ingredient.id;
                }).map((tag) => {
                    return tag.tag_text;
                }).sort();

                ingredient.tags = t;
            }

            return res.json({
                ingredients: ingredients
            });
        });
}

function addIngredientAlternatives(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }

        let ingredient_id = req.swagger.params.id.value;
        let alts = req.swagger.params.alternatives.value.ingredients;

        let data = alts.map((alt_id) => {
            return {
                "ingredient_id": ingredient_id,
                "alt_ingredient_id": alt_id
            };
        });

        knex("ingredient_alternatives")
            .insert(data)
            .returning('*')
            .then((result) => {
                return Ingredient.forge({
                        id: req.swagger.params.id.value
                    })
                    .fetch({
                        withRelated: ['tags', 'alternatives']
                    });
            })
            .then((ingredient) => {
                let ingredientObj = ingredient.serialize();
                ingredientObj.tags = ingredientObj.tags.map((value) => {
                    return value.tag_text;
                }).sort();

                ingredientObj.alternatives = ingredientObj.alternatives.map((value) => {
                    return {
                        id: value.id,
                        name: value.name
                    };
                }).sort();

                delete ingredientObj.created_at;
                delete ingredientObj.updated_at;

                let qstring = url.format({
                    query: {
                        app_id: process.env.EDAMAM_APP_ID,
                        app_key: process.env.EDAMAM_APP_KEY,
                        ingr: "one " + ingredientObj.name
                    }
                });
                fetch('https://api.edamam.com/api/nutrition-data' + qstring)
                    .then((fetchResponse) => {
                        return fetchResponse.json();
                    })
                    .then((fetchResponse) => {
                        ingredientObj.calories = fetchResponse.calories;

                        return res.json(ingredientObj);
                    });
            });
      });
}

function getPieDataSet(req, res) {
  return knex.raw(
    `select category, count(*) as count
      from (
        select ingredient_id,
        case
        when tag_text <> 'vegan' and tag_text <> 'vegetarian' then
          'neither'
        else
        tag_text
        end
        as category from ingredient_tags
      ) as sq1 group by category;`)
      .then((data) => {
        return res.json(data.rows)
       });
}
