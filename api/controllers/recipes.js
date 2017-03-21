'use strict';
const knex = require('../../knex');

module.exports = {
  getRecipesList: getRecipesList,
  getRecipe: getRecipe,
  postRecipe: postRecipe
};

// /recipes
function getRecipesList(req, res) {
  return knex("recipes").then((rows) => {
    let result = { recipes: rows };
    return res.json(result);
  });
}

// /recipes:id

function getRecipe(req, res) {
  return knex("recipes")
    .first().where("id", req.swagger.params.id.value)
    .then((result) => {
      return res.json(result);
    })
}

function postRecipe(req, res) {
  let recipe = {
    id: req.swagger.params.body.value.id,
    name: req.swagger.params.body.value.name,
    instruction: req.swagger.params.body.value.instruction
  }
  knex('recipes').insert(recipe)
    .returning('id')
    .then((result) => {
      recipe.id = result[0];
      res.json(recipe)
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
    })

}

function updateRecipe(req, res) {

}
