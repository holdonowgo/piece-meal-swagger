'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
const Ingredient = require('../models/ingredient.js').Ingredient;
const Ingredients = require('../models/ingredient.js').Ingredients;
const IngredientTag = require('../models/ingredient_tag.js').IngredientTag;
const IngredientTags = require('../models/ingredient_tag.js').IngredientTags;
const AlternativeIngredient = require('../models/ingredients_ingredients.js').AlternativeIngredient;
const AlternativeIngredients = require('../models/ingredients_ingredients.js').AlternativeIngredients;
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const url = require('url');
const Promise = require('bluebird');

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

        new Ingredient({id: id})
        .save({name: name, description: description, image_url: image_url}, {patch: true})
        .then(function(model) {
          return Ingredient.forge({
                  id: req.swagger.params.id.value
              })
              .fetch({
                  withRelated: ['alternatives', 'tags']
              })
        })
        .then((ingredient) => {
          return res.status(200).json(ingredient);
        });
        // return res.status(200).send(model.toJSON());

        // Ingredient.forge({
        //     id: req.swagger.params.id.value
        //   })
        //   .fetch()
        //   .then((ingredient) => {
        //     if(!ingredient) {
        //       res.status(404).json('Not Found');
        //     } else {
        //       return knex('ingredients')
        //           .where('id', id)
        //           .update({
        //               name: name,
        //               description: description,
        //               image_url: image_url
        //           })
        //           .returning('*');
        //         }
        //       })
        //       .then((result) => {
        //         return knex('ingredients_tags').where('ingredient_id', id).del();
        //       })
        //       .then((result) => {
        //         let data = tags.map((tag) => {
        //           return { "ingredient_id": id, "tag_text": tag.toLowerCase() };
        //         })
        //         return knex('ingredients_tags').insert(data).returning("*");
        //       })
        //       .then((result) => {
        //           return getIngredient(req, res);
        //       });
        });
}

function deleteIngredient(req, res) {
  new Ingredient({id: req.swagger.params.id.value})
  .destroy()
  .then(function(model) {
    return res.status(200).json(model);
  });
  // Ingredient.forge({id: req.swagger.params.id.value}).fetch().destroy().then((item) => {
  //   return getIngredient(req, res);
  // });

  // Ingredient.forge({id: req.swagger.params.id.value}).fetch({
  //   withRelated:['tags', 'alternatives']
  //   }).then(function (item) {
  //     return item.related('tags').invokeThen('destroy').then(function () {
  //       return item.destroy().then(function () {
  //         console.log('destroyed!');
  //         return res.status(200).json(item);
  //       });
  //     });
  //   });

    // jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
    //     if (err) {
    //         res.set('Content-Type', 'application/json');
    //         res.status(401).send('Unauthorized');
    //     }
    //
    //     knex('ingredients')
    //         .where('id', req.swagger.params.id.value)
    //         .update({
    //             active: false
    //         })
    //         .returning('*')
    //         .then((result) => {
    //             let ingredient = result[0];
    //             delete ingredient.created_at;
    //             delete ingredient.updated_at;
    //             return res.status(200).json(ingredient);
    //         });
    //   });
}

function getIngredientsList(req, res) {
    // To list ingredients
    let promises = [];
    promises.push(knex("ingredients")
                  .select("id", "name", "description", "active", "image_url")
                  .where('active', 1)
                  .orderBy('ingredients.name'));
    promises.push(knex("ingredients_tags").select("ingredient_id", "tag_text"));
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

            return res.status(200).json({ ingredients: ingredients });
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
            return res.status(200).json(alternative);
        });
}

function fetchIngredient(id, res) {
  Ingredient.forge({
      id: id
    })
    .where('active', '=', 1)
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

        return res.status(200).json(ingredientObj);

        // let qstring = url.format({
        //   query: {
        //     app_id: process.env.EDAMAM_APP_ID,
        //     app_key: process.env.EDAMAM_APP_KEY,
        //     ingr: "one " + ingredientObj.name
        //   }
        // });
        // return fetch('https://api.edamam.com/api/nutrition-data' + qstring)
        //   .then((fetchResponse) => {
        //     return fetchResponse.json();
        //   })
        //   .then((fetchResponse) => {
        //     ingredientObj.calories = fetchResponse.calories;
        //
        //     return res.status(200).json(ingredientObj);
        //   });
        }
    });
}

function getIngredient(req, res) {
  // return fetchIngredient(req.swagger.params.id.value, res);

  bookshelf.transaction((t) => {
    return new Ingredient({name: 'New Ingredient'})
      .save(null, {transacting: t})
      .tap(function(model) {
        return Promise.map([
          {tag_text: 'first tag'},
          {tag_text: 'second tag'},
          {tag_text: 'third tag'}
        ], (info) => {
          // Some validation could take place here.
          return new IngredientTag(info).save({'ingredient_id': model.id}, {transacting: t});
        });
      });
  }).then((ingredient) => {
    // console.log(ingredient.related('tags').pluck('tag_text'));
  }).catch((err) => {
    console.error(err);
  });
  // new Ingredient({name: 'New Ingredient'}).save().then(function(model) {
  //   console.log('model:', model.toJSON());
  // });
  // new IngredientTag({ingredient_id: 1, tag_text: 'New Ingredient'}).save().then(function(model) {
  //   console.log('model:', model.toJSON());
  // });

  Ingredient.forge({
          id: req.swagger.params.id.value
      })
      .fetch({
          withRelated: ['alternatives', 'tags']
      })
      .then((ingredient) => {
        return res.status(200).json(ingredient);
      });
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
        let alternatives = req.swagger.params.ingredient.value.alternatives;
        let tags = req.swagger.params.ingredient.value.tags;

        bookshelf.transaction((t) => {
          return new Ingredient({name: name, description: description, image_url: image_url})
            .save(null, {transacting: t})
            .tap(function(model) {
              let newTags = tags.map((tag) => {
                return {tag_text: tag}
              })
              return Promise.map(newTags, (info) => {
                // Some validation could take place here.
                return new IngredientTag(info).save({'ingredient_id': model.id}, {transacting: t});
              });
            })
            .tap(function(model) {
              let newAlts = alternatives.map((altIngredient) => {
                // console.log('altIngredient.alt_ingredient_id:', altIngredient.alt_ingredient_id);
                return {'alt_ingredient_id': altIngredient.alt_ingredient_id, 'ratio': altIngredient.ratio }
              })
              return Promise.map(newAlts, (info) => {
                // Some validation could take place here.
                // console.log('model.id:', model.id);
                return new AlternativeIngredient(info).save({'ingredient_id': model.id}, {transacting: t});
              });
            });
        }).then((ingredient) => {
          // console.log(ingredient.related('tags').pluck('tag_text'));
          return fetchIngredient(ingredient.id, res);
        }).catch((err) => {
          console.error(err);
        });

        // let id;
        //
        // knex("ingredients")
        //     .first().where("name", name)
        //     .then((result) => {
        //         if (result) {
        //             delete result.created_at;
        //             delete result.updated_at;
        //             return res.status(400).json({
        //                 message: 'Ingredient already exists!',
        //                 ingredient: result
        //             });
        //             // throw new Error('Ingredient already exists!');
        //         } else {
        //             return knex("ingredients")
        //               .returning('*')
        //               .insert({
        //                 "name": name,
        //                 "description": description,
        //                 "image_url": image_url
        //               })
        //               .then((ingredient) => {
        //                 id = ingredient[0].id;
        //                   if (req.swagger.params.ingredient.value.tags) {
        //                       let promises = [];
        //                       for (let tag of req.swagger.params.ingredient.value.tags) {
        //                           promises.push(
        //                               knex("ingredients_tags")
        //                               .returning('*')
        //                               .insert({
        //                                   "ingredient_id": id,
        //                                   "tag_text": tag.toLowerCase()
        //                               })
        //                           );
        //                       }
        //
        //                       // ingredient[0].tags = req.swagger.params.ingredient.value.tags;
        //                       // return ingredient[0];
        //                       return Promise.all(promises);
        //                   }
        //               })
        //               .then((promises) => {
        //                 return fetchIngredient(id, res);
        //               })
        //               .catch((error) => {
        //                 console.error(error);
        //               })
        //             }
        //     });
      });
}

function searchIngredients(req, res) {
    // To list clients
    let text = req.swagger.params.text.value;
    let promises = [];

    promises.push(
        knex("ingredients")
        // .select("ingredients.id", "name", "active")
        .leftJoin('ingredients_tags', 'ingredients.id', 'ingredients_tags.ingredient_id')
        .distinct("ingredients.id", "ingredients.name", "ingredients.image_url", "ingredients.active")
        .where('active', 1)
        .andWhere('name', 'ilike', `%${text}%`)
        .orWhere('ingredients_tags.tag_text', 'ilike', `%${text}%`)
        .orderBy('ingredients.name')
    );
    promises.push(knex("ingredients_tags").select("ingredient_id", "tag_text"));
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

            return res.status(200).json({
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
                // fetch('https://api.edamam.com/api/nutrition-data' + qstring)
                //     .then((fetchResponse) => {
                //         return fetchResponse.json();
                //     })
                //     .then((fetchResponse) => {
                //         ingredientObj.calories = fetchResponse.calories;
                //
                //         return res.status(200).json(ingredientObj);
                //     });
                return res.status(200).json(ingredientObj);
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
        as category from ingredients_tags
      ) as sq1 group by category;`)
      .then((data) => {
        return res.status(200).json(data.rows)
       });
}
