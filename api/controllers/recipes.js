'use strict';
const knex = require('../../knex');

module.exports = {
  getRecipesList: getRecipesList,
  getRecipe: getRecipe,
  postRecipe: postRecipe
};

function getRecipesList(req, res) {
  return knex("recipes").then((rows) => {
    let result = { recipes: rows };
    return res.json(result);
  });
}

function getRecipe(req, res) {
  return knex("recipes")
    .first().where("id", req.swagger.params.id.value)
    .then((result) => {
      return res.json(result);
    })
}

function postRecipe(req, res) {
  
}
