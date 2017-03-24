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

function getRecipe(req, res) {
  let promises = [];
  promises.push(
    knex("recipes")
    .select("id", "name", "instructions")
    .first()
    .where("id", req.swagger.params.id.value)
  );
  promises.push(
    knex("recipe_ingredients")
    .join("ingredients", "ingredients.id", "recipe_ingredients.ingredient_id")
    .select("recipe_ingredients.recipe_id", "ingredients.*")
    .where("recipe_ingredients.recipe_id", req.swagger.params.id.value)
  );
  Promise.all(promises)
    .then((results) => {
      let recipe = results[0];
      let ingredients = results[1]
      // console.log(results[1]); --> recipe_id, id(ingredient)
      if (!recipe) {
        res.set('Content-Type', 'application/json')
        res.sendStatus(404);
      }
      recipe["ingredients"] = ingredients.map((ingredient) => {
        return {
          id: ingredient.id,
          name: ingredient.name,
        };
      }).sort();
      return res.json(recipe);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
}

function postRecipe(req, res) {
  //to insert into recipes table
  let name = req.swagger.params.recipe.value.name;
  let instructions = req.swagger.params.recipe.value.instructions;

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
          "instructions": instructions
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
      return knex('recipe_ingredients').insert(data).returning("*");
    })
    .then((recipe) => {
      return res.json({
        id: recipe[0].recipe_id
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
