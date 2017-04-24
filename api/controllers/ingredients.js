

const knex = require("../../knex");
const bookshelf = require("../../bookshelf");
const Ingredient = require("../models/ingredient.js").Ingredient;
const IngredientTag = require("../models/ingredient.js").IngredientTag;
const IngredientTags = require("../models/ingredient.js").IngredientTags;
const fetch = require("node-fetch");
const url = require("url");

module.exports = {
  getIngredient,
  addIngredient,
  getIngredientsList,
  deleteIngredient,
  searchIngredients,
  getIngredientAlternatives,
  addIngredientAlternatives
};

// add comments above each function describing what they do.
function updateIngredient(req, res, next) {
  knex("ingredients")
        .where("id", req.swagger.params.id.value)
        .update({
          name: req.swagger.params.ingredient.value.name
        })
        .returning("*")
        .then((result) => {
          const ingredient = result[0];
            // ingredient.alternatives = [];
          delete ingredient.created_at;
          delete ingredient.updated_at;
          return res.json(ingredient);
        });

  const name = req.swagger.params.ingredient.value.name;
  let id;
  knex("ingredients")
        .first().where("name", name)
        .then((result) => {
          if (result) {
            delete result.created_at;
            delete result.updated_at;
            res.status(400).json({
              message: "Ingredient already exists!",
              ingredient: result
            });
            throw new Error("Ingredient already exists!");
          } else {
            return knex("ingredients")
                    .insert({
                      name
                    }).returning("*");
          }
        })
        .then((ingredient) => {
          if (req.swagger.params.ingredient.value.tags) {
            const promises = [];
            for (const val of req.swagger.params.ingredient.value.tags) {
              promises.push(
                        knex("ingredient_tags").insert({
                          ingredient_id: ingredient[0].id,
                          tag_test: val
                        }).returning("*")
                    );
            }
            return ingredient;
          }
        })
        .then((ingredient) => {
            // return res.json(queryIngredient(ingredient[0].id));
          const newIngredient = req.swagger.params.ingredient.value;
          newIngredient.id = ingredient[0].id;
          return res.json(newIngredient);
        })
        .catch((error) => {

        });
}

// add comments above each function describing what they do.
function deleteIngredient(req, res) {
    // take out code you're not using.
  knex("ingredients")
        .where("id", req.swagger.params.id.value)
        .update({
          active: false
        })
        .returning("*")
        .then((result) => {
          const ingredient = result[0];
            // ingredient.alternatives = [];
          delete ingredient.created_at;
          delete ingredient.updated_at;
          return res.json(ingredient);
        });
}

// add comments above each function describing what they do.
function getIngredientsList(req, res) {
    // To list ingredients
  const promises = [];
  promises.push(knex("ingredients").select("id", "name", "active"));
  promises.push(knex("ingredient_tags").select("ingredient_id", "tag_text"));
  Promise.all(promises)
        .then((results) => {
          const ingredients = results[0];
          const tags = results[1];

          for (const ingredient of ingredients) {
            const t = tags.filter(tag => tag.ingredient_id === ingredient.id).map(tag => tag.tag_text).sort();

            ingredient.tags = t;
          }

          return res.json({
            ingredients
          });
        });
}

// add comments above each function describing what they do.
function getIngredientAlternatives(req, res) {
  knex("ingredients")
        .join("ingredient_alternatives", "ingredient_alternatives.alt_ingredient_id", "ingredients.id")
        .select("ingredients.id", "name")
        .where("ingredient_alternatives.ingredient_id", req.swagger.params.id.value)
        .then((alternatives) => {
          for (const alternative of alternatives) {
            const qstring = url.format({
              query: {
                app_id: process.env.EDAMAM_APP_ID,
                app_key: process.env.EDAMAM_APP_KEY,
                ingr: `one ${alternative.name}`
              }
            });
            return fetch(`https://api.edamam.com/api/nutrition-data${qstring}`);
          }
        })
        .then(fetchResponse => fetchResponse.json())
        .then((fetchResponse) => {
          alternative.calories = fetchResponse.calories;
          return res.json(alternative);
        });
}

// add comments above each function describing what they do.
function getIngredient(req, res) {
    // let promises = [];
    // promises.push(
    //     knex("ingredients").select("id", "name", "active")
    //     .first().where("id", req.swagger.params.id.value)
    // );
    // promises.push(
    //     knex("ingredient_tags").select("ingredient_id", "tag_text")
    //     .where("ingredient_id", req.swagger.params.id.value)
    // );
    // promises.push(
    //     knex("ingredients")
    //     .join('ingredient_alternatives', 'ingredient_alternatives.alt_ingredient_id', 'ingredients.id')
    //     .select("ingredients.id", "name")
    //     .where("ingredient_alternatives.ingredient_id", req.swagger.params.id.value)
    // );
    // Promise.all(promises)
    //     .then((results) => {
    //         let ingredient = results[0];
    //         let tags = results[1];
    //         let alts = results[2];
    //
    //         if (ingredient === undefined) {
    //             res.status(400).json('Ingredient not found');
    //         } else {
    //             let t = tags.map((tag) => {
    //                 return tag.tag_text;
    //             }).sort();
    //
    //             let a = alts.map((alt) => {
    //                 return {
    //                     id: alt.id,
    //                     name: alt.name
    //                 };
    //             }).sort();
    //
    //             ingredient.tags = t;
    //             ingredient.alternatives = a;
    //
    //             delete ingredient.created_at;
    //             delete ingredient.updated_at;
    //
    //             let qstring = url.format({
    //                 query: {
    //                     app_id: 28647724,
    //                     app_key: '18bfd98d4fa0153e80aeb1bff05d6355',
    //                     ingr: "one " + ingredient.name
    //                 }
    //             });
    //             return fetch('https://api.edamam.com/api/nutrition-data' + qstring)
    //                 .then((fetchResponse) => {
    //                     return fetchResponse.json();
    //                 })
    //                 .then((fetchResponse) => {
    //                     ingredient.calories = fetchResponse.calories;
    //                     return res.json(ingredient);
    //                 });
    //
    //             // return res.json(ingredient);
    //         }
    //     });

  Ingredient.forge({
    id: req.swagger.params.id.value
  })
        .fetch({
          withRelated: ["tags", "alternatives"]
        })
        .then((ingredient) => {
          const ingredientObj = ingredient.serialize();
          ingredientObj.tags = ingredientObj.tags.map(value => value.tag_text).sort();

          ingredientObj.alternatives = ingredientObj.alternatives.map(value => ({
            id: value.id,
            name: value.name
          })).sort();

          delete ingredientObj.created_at;
          delete ingredientObj.updated_at;

          const qstring = url.format({
            query: {
              app_id: process.env.EDAMAM_APP_ID,
              app_key: process.env.EDAMAM_APP_KEY,
              ingr: `one ${ingredientObj.name}`
            }
          });
          return fetch(`https://api.edamam.com/api/nutrition-data${qstring}`)
                .then(fetchResponse => fetchResponse.json())
                .then((fetchResponse) => {
                  ingredientObj.calories = fetchResponse.calories;

                  return res.json(ingredientObj);
                });
        });

    // let ingredientObj;
    // Ingredient.forge({
    //         id: req.swagger.params.id.value
    //     })
    //     .fetch({
    //         withRelated: ['tags', 'alternatives']
    //     })
    //     .then((ingredient) => {
    //         ingredientObj = ingredient.serialize();
    //         ingredientObj.tags = ingredientObj.tags.map((value) => {
    //             return value.tag_text;
    //         }).sort();
    //         ingredientObj.alternatives = ingredientObj.alternatives.map((value) => {
    //             return value.alt_ingredient_id;
    //         }).sort();
    //         console.log(ingredientObj);
    //         // ingredientObj.alternatives = [];
    //         delete ingredientObj.created_at;
    //         delete ingredientObj.updated_at;
    //
    //         let qstring = url.format({
    //             query: {
    //                 app_id: 28647724,
    //                 app_key: '18bfd98d4fa0153e80aeb1bff05d6355',
    //                 ingr: "one " + ingredientObj.name
    //             }
    //         });
    //         return fetch('https://api.edamam.com/api/nutrition-data' + qstring)
    //             .then((fetchResponse) => {
    //                 return fetchResponse.json();
    //             })
    //             .then((fetchResponse) => {
    //                 ingredientObj.calories = fetchResponse.calories;
    //                 return res.json(ingredientObj);
    //             });
    //
    //     });
}

// take out code you're not using.

// add comments above each function describing what they do.
function addIngredient(req, res, next) {
  const name = req.swagger.params.ingredient.value.name;
  let id;
  knex("ingredients")
        .first().where("name", name)
        .then((result) => {
          if (result) {
            delete result.created_at;
            delete result.updated_at;
            res.status(400).json({
              message: "Ingredient already exists!",
              ingredient: result
            });
            throw new Error("Ingredient already exists!");
          } else {
            return knex("ingredients").insert({
              name
            }).returning("*");
          }
        })
        .then((ingredient) => {
          if (req.swagger.params.ingredient.value.tags) {
            const promises = [];
            for (const val of req.swagger.params.ingredient.value.tags) {
              promises.push(
                        knex("ingredient_tags").insert({
                          ingredient_id: ingredient[0].id,
                          tag_test: val
                        }).returning("*")
                    );
            }
            return ingredient;
          }
        })
        .then((ingredient) => {
            // return res.json(queryIngredient(ingredient[0].id));
          const newIngredient = req.swagger.params.ingredient.value;
          newIngredient.id = ingredient[0].id;
          return res.json(newIngredient);
        })
        .catch((error) => {

        });
}

// add comments above each function describing what they do.
function searchIngredients(req, res) {
    // To list clients
  const text = req.swagger.params.text.value;
  const promises = [];

  promises.push(
        knex("ingredients")
        // .select("ingredients.id", "name", "active")
        .leftJoin("ingredient_tags", "ingredients.id", "ingredient_tags.ingredient_id")
        .distinct("ingredients.id", "name", "active")
        .where("name", "ilike", `%${text}%`)
        .orWhere("ingredient_tags.tag_text", "ilike", `%${text}%`)
        .orderBy("ingredients.id")
    );
  promises.push(knex("ingredient_tags").select("ingredient_id", "tag_text"));
  Promise.all(promises)
        .then((results) => {
          const ingredients = results[0];
          const tags = results[1];

          for (const ingredient of ingredients) {
            const t = tags.filter(tag => tag.ingredient_id === ingredient.id).map(tag => tag.tag_text).sort();

            ingredient.tags = t;
          }

          return res.json({
            ingredients
          });
        });
}

// add comments above each function describing what they do.
function addIngredientAlternatives(req, res) {
  const ingredient_id = req.swagger.params.id.value;
  const alts = req.swagger.params.alternatives.value.ingredients;

  const data = alts.map(alt_id => ({
    ingredient_id,
    alt_ingredient_id: alt_id
  }));

  knex("ingredient_alternatives")
        .insert(data)
        .returning("*")
        .then(result => Ingredient.forge({
          id: req.swagger.params.id.value
        })
                .fetch({
                  withRelated: ["tags", "alternatives"]
                }))
        .then((ingredient) => {
          const ingredientObj = ingredient.serialize();
          ingredientObj.tags = ingredientObj.tags.map(value => value.tag_text).sort();

          ingredientObj.alternatives = ingredientObj.alternatives.map(value => ({
            id: value.id,
            name: value.name
          })).sort();

          delete ingredientObj.created_at;
          delete ingredientObj.updated_at;

          const qstring = url.format({
            query: {
              app_id: process.env.EDAMAM_APP_ID,
              app_key: process.env.EDAMAM_APP_KEY,
              ingr: `one ${ingredientObj.name}`
            }
          });
          fetch(`https://api.edamam.com/api/nutrition-data${qstring}`)
                .then(fetchResponse => fetchResponse.json())
                .then((fetchResponse) => {
                  ingredientObj.calories = fetchResponse.calories;

                  return res.json(ingredientObj);
                });
        });
}
