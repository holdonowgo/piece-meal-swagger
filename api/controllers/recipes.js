'use strict';
const knex = require('../../knex');

module.exports = {
  getRecipesList: getRecipesList,
  getRecipe: getRecipe,
  postRecipe: postRecipe,
  updateRecipe: updateRecipe,
  deleteRecipe: deleteRecipe
};

// /recipes
function getRecipesList(req, res) {
  return knex("recipes").then((rows) => {
    let result = {
      recipes: rows
    };
    return res.json(result);
  });
}

// /recipes:id

function getRecipe(req, res) {
  return knex("recipes")
    .first().where("id", req.swagger.params.id.value)
    .then((result) => {
      return res.json(result);
    });
}

function postRecipe(req, res) {
  //to insert into recipes table
  let name = req.swagger.params.recipe.value.name;
  let instruction = req.swagger.params.recipe.value.instruction;

  //to insert into recipe_ingredients table
  let ingredients = req.swagger.params.recipe.value.ingredients;
  knex("recipes")
    .first().where("name", name)
    .then((result) => {
      if (result) {
        res.status(400).json("Recipe already exists!");
      } else {
        return knex("recipes").insert({
          "name": name,
          "instruction": instruction
        }).returning("*");
      }
    })
    .then((recipes) => {
      const recipe = recipes[0];
      let data = ingredients.map((value) => {
        return {
          recipe_id: recipe.id,
          ingredient_id: value
        };
      });
      return knex('recipe_ingredients').insert(data)
      .then(() => {
        return res.json({id: recipe.id});
      });
    });
}

function updateRecipe(req, res) {
  let id = req.swagger.params.id.value;
  return knex('recipes')
    .update(req.swagger.params.recipe.value)
    .then(() => {
      return knex('recipes').where('id', id);
    })
    .then((recipes) => {
      let recipe = recipes[0];
      res.json(recipe);
    });
}

function deleteRecipe(req, res) {
  let id = Number(req.swagger.params.id.value);
  return knex('recipes').where('id', id)
    .then((result) => {
      let recipe = result[0];
      delete recipe.id;
      res.json(recipe);
    })
    .then(() => {
      knex('recipes').where('id', id).del();
    });
}
