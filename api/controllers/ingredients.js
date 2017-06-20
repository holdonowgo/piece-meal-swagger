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
  getPieDataSet: getPieDataSet,
  getSafeIngredients: getSafeIngredients
};

function getSafeIngredients(req, res) {
  let id = req.swagger.params.user_id.value;
  let promises = [];

  promises.push(
    knex('ingredients')
    .whereNotExists(function() {
    this.select('*').from('client_restrictions')
        .whereRaw('ingredients.id = client_restrictions.ingredient_id')
        .where('client_restrictions.client_id', id);
  }).orderBy('ingredients.name'));

  promises.push(knex("ingredients_tags").select("ingredient_id", "tag_text"));
  Promise.all(promises).then((results) => {
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
    console.log('count:', ingredients.length);
    return res.status(200).json({ingredients: ingredients});
  });
}

function updateIngredient(req, res, next) {
  jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      res.status(401).send('Unauthorized');
    }

    let id = req.swagger.params.id.value;

    Ingredient.forge({
        id: req.swagger.params.id.value
      })
      .fetch()
      .then((ingredient) => {
        if(!ingredient) {
          return res.status(404).json('Not Found');
        } else {
            let name = req.swagger.params.ingredient.value.name;
            let description = req.swagger.params.ingredient.value.description;
            let tags = req.swagger.params.ingredient.value.tags;
            let image_url = req.swagger.params.ingredient.value.image_url;

            new Ingredient({id: id}).save({
              name: name,
              description: description,
              image_url: image_url
            }, {patch: true}).then(function(model) {
              return Ingredient.forge({id: req.swagger.params.id.value}).fetch({
                withRelated: ['alternatives', 'tags']
              })
            }).then((ingredient) => {
              let ingredientObj = ingredient.serialize();
              ingredientObj.tags = mapTags(ingredientObj.tags);
              // ingredientObj.alternatives = mapAlts(ingredientObj.alternatives);

              return res.status(200).send(ingredientObj);
            });
          }
      });
  });
}

function deleteIngredient(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
      if (err) {
          res.set('Content-Type', 'application/json');
          res.status(401).send('Unauthorized');
      }

      const id = req.swagger.params.id.value;

      Ingredient.forge({id: id}).where('active', id).fetch()
      .then((ingredient) => {
        if (!ingredient) {
          res.status(404).json('Not Found');
        } else {
            // new Ingredient({id: id}).destroy().then(function(model) {
            //   return res.status(204).json(model);
            // });

            Ingredient.forge({
              id: req.swagger.params.id.value
            }).destroy().then((model) => {
              res.set('Content-Type', 'application/json');
              return res.sendStatus(204);
            })
            .catch((err) => {
              console.error(err);
            });
        }

//     knex('ingredients')
//         .where('id', req.swagger.params.id.value)
//         .update({
//             active: false
//         })
//         .returning('*')
//         .then((result) => {
//             let ingredient = result[0];
//             delete ingredient.created_at;
//             deleteingredient.updated_at;
//             return res.status(200).json(ingredient);
//         });
        });
    });
}

function getIngredientsList(req, res) {
  // To list ingredients
  let promises = [];
  promises.push(knex("ingredients").select("id", "name", "description", "active", "image_url").where('active', 1).orderBy('ingredients.name'));
  promises.push(knex("ingredients_tags").select("ingredient_id", "tag_text"));
  Promise.all(promises).then((results) => {
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

    return res.status(200).json({ingredients: ingredients});
  });
}

function getIngredientAlternatives(req, res) {
  knex("ingredients").join('ingredient_alternatives', 'ingredient_alternatives.alt_ingredient_id', 'ingredients.id').select("ingredients.id", "name").where("ingredient_alternatives.ingredient_id", req.swagger.params.id.value).orderBy('ingredients.name').then((alternatives) => {
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
  }).then((fetchResponse) => {
    return fetchResponse.json();
  }).then((fetchResponse) => {
    alternative.calories = fetchResponse.calories;
    return res.status(200).json(alternative);
  });
}

function fetchIngredient(id, res) {
  Ingredient.forge({id: id}).where('active', '=', 1).fetch({
    withRelated: ['tags', 'alternatives']
  }).then((ingredient) => {
    if (!ingredient) {
      res.status(404).json('Not Found');
    } else {
      let ingredientObj = ingredient.serialize();

      ingredientObj.tags = mapTags(ingredientObj.tags);

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
  return fetchIngredient(req.swagger.params.id.value, res);
}

function mapTags(tags) {
  return tags.map(tag => tag.tag_text).sort();
}

function addIngredient(req, res, next) {
  jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
    if (err) {
      res.set('Content-Type', 'application/json');
      return res.status(401).send('Unauthorized');
    }

    if(!req.swagger.params.ingredient.value.name) {
      return res.status(400).json({ message: 'Ingredient name required!!' });
    }

    let name = req.swagger.params.ingredient.value.name;

    Ingredient.forge({name: name}).fetch().then((result) => {
      if (result) {
        return res.status(400).json({message: 'Ingredient already exists!', ingredient: result});
      } else {

        let description = req.swagger.params.ingredient.value.description;
        let image_url = req.swagger.params.ingredient.value.image_url;
        let alternatives = req.swagger.params.ingredient.value.alternatives || [];
        let tags = req.swagger.params.ingredient.value.tags || [];

        bookshelf.transaction((t) => {
          return new Ingredient({name: name, description: description, image_url: image_url}).save(null, {transacting: t}).tap(function(model) {
            if(tags) {
              let newTags = tags.map((tag) => {
                return {tag_text: tag}
              })
              return Promise.map(newTags, (info) => {
                // Some validation could take place here.
                return new IngredientTag(info).save({
                  'ingredient_id': model.id
                }, {transacting: t});
              });
            }
          }).tap(function(model) {

            let newAlts = alternatives.map((altIngredient) => {
              return {'alt_ingredient_id': altIngredient.id, 'ratio': altIngredient.ratio}
            })
            return Promise.map(newAlts, (info) => {
              // Some validation could take place here.
              // console.log('model.id:', model.id);
              return new AlternativeIngredient(info).save({
                'ingredient_id': model.id
              }, {transacting: t});
            });
          });
        }).then((ingredient) => {
          // console.log(ingredient.related('tags').pluck('tag_text'));
          return fetchIngredient(ingredient.id, res);
        }).catch((err) => {
          console.error(err);
        });
        knex("ingredients_tags")
      }
    });
  });
}

function searchIngredients(req, res) {
  // To list clients
  let text = req.swagger.params.text.value;
  let promises = [];

  promises.push(knex("ingredients")
  // .select("ingredients.id", "name", "active")
    .leftJoin('ingredients_tags', 'ingredients.id', 'ingredients_tags.ingredient_id').distinct("ingredients.id", "ingredients.name", "ingredients.image_url", "ingredients.active").where('active', 1).andWhere('name', 'ilike', `%${text}%`).orWhere('ingredients_tags.tag_text', 'ilike', `%${text}%`).orderBy('ingredients.name'));
  promises.push(knex("ingredients_tags").select("ingredient_id", "tag_text"));
  Promise.all(promises).then((results) => {
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

    return res.status(200).json({ingredients: ingredients});
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
      return {"ingredient_id": ingredient_id, "alt_ingredient_id": alt_id};
    });

    knex("ingredient_alternatives").insert(data).returning('*').then((result) => {
      return Ingredient.forge({id: req.swagger.params.id.value}).fetch({
        withRelated: ['tags', 'alternatives']
      });
    }).then((ingredient) => {
      let ingredientObj = ingredient.serialize();

      ingredientObj.tags = mapTags(ingredientObj.tags);

      // let qstring = url.format({
      //     query: {
      //         app_id: process.env.EDAMAM_APP_ID,
      //         app_key: process.env.EDAMAM_APP_KEY,
      //         ingr: "one " + ingredientObj.name
      //     }
      // });
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

// function mapAlts(alts) {
//   return alts.map((value) => {
//       return {
//           id: value.id,
//           name: value.name
//       };
//   }).sort();
// }

function getPieDataSet(req, res) {
  return knex.raw(`select category, count(*) as count
      from (
        select ingredient_id,
        case
        when tag_text <> 'vegan' and tag_text <> 'vegetarian' then
          'neither'
        else
        tag_text
        end
        as category from ingredients_tags
      ) as sq1 group by category;`).then((data) => {
    return res.status(200).json(data.rows)
  });
}
