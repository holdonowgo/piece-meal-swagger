'use strict';
const knex = require('../../knex');

module.exports = {
  getRecipesList: getRecipesList,
  getRecipe: getRecipe
  // postRecipe: postRecipe
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
    });
}

function postRecipe(req, res) {
  //insert into recipes table
  let name = req.swagger.params.recipe.value.name;
  let instruction = req.swagger.params.recipe.value.instruction;

  //insert into recipe_ingredients table
  let ingredient = req.swagger.params.recipe.value.ingredient;
  let id;
  knex("recipes")
    .first().where("name", name)
    .then((result) => {
      if (result) {
        res.status(400).json("Ingredient already exists!")
      } else {
        return knex("recipes").insert({
          "name":name,
          "instruction": instruction
        }).returning("*");
     }
    })


};



// function deleteRecipe(req, res) {
//   let id = Number(req.swagger.params.id.value);
//   return knex('recipes').where('id', id)
//     .then((result) => {
//       let recipe = result[0];
//       delete recipe.id;
//       res.json(recipe);
//     })
//     .then(() => {
//       knex('recipes').where('id', id).del();
//     })
//
// }
//
// function updateRecipe(req, res) {
//
// }
