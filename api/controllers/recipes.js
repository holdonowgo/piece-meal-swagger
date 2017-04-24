

const knex = require("../../db/knex"); // moded all the database connection items into a directory.

module.exports = {
  getRecipesList,
  getClientRecipes,
  addClientRecipe,
  getRecipe,
  postRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes
};

// add comments above each function describing what they do.
function doGetRecipes(query, res) {
  let recipes;
  return query.then((rows) => {
    recipes = rows;
    const promises = rows.map(recipe => getIngredientsQuery(recipe.id));
    return Promise.all(promises);
  }).then((promiseResults) => {
        // 'recipes' is an array of the recipes
        // 'promiseResults' is an array of arrays of ingredients
    for (let i = 0; i < recipes.length; i++) {
      recipes[i].ingredients = promiseResults[i];
    }
    return res.json({
      recipes
    });
  });
}

// /recipes
// add comments above each function describing what they do.
function getRecipesList(req, res) {
  return doGetRecipes(knex("recipes"), res);
}

// add comments above each function describing what they do.
function getClientRecipes(req, res) {
  const query = knex("recipes")
        .join("client_recipes", "client_recipes.recipe_id", "recipes.id")
        .select("recipes.*")
        .where("client_recipes.client_id", req.swagger.params.user_id.value);
  return doGetRecipes(query, res);
}

// add comments above each function describing what they do.
function addClientRecipe(req, res) {
  return knex("client_recipes")
        .insert({
          client_id: req.swagger.params.user_id.value,
          recipe_id: req.swagger.params.request.value.recipe_id
        }).then(() => {
          res.json({
            success: 1,
            description: "Added"
          });
        });
}

// add comments above each function describing what they do.
function getIngredientsQuery(recipeId) {
  return knex("recipe_ingredients")
        .join("ingredients", "ingredients.id", "recipe_ingredients.ingredient_id")
        .select("ingredients.*")
        .orderBy("id")
        .where("recipe_ingredients.recipe_id", recipeId);
}

// add comments above each function describing what they do.
function getRecipe(req, res) {
  return doGetRecipe(req.swagger.params.id.value, res);
}

// add comments above each function describing what they do.
function doGetRecipe(recipeId, res) {
  const promises = [];
  promises.push(
        knex("recipes")
        .select("id", "name", "instructions")
        .first()
        .where("id", recipeId)
    );
  promises.push(getIngredientsQuery(recipeId));
  Promise.all(promises)
        .then((results) => {
          const recipe = results[0];
          const ingredients = results[1];

          if (!recipe) {
            res.set("Content-Type", "application/json");
            res.sendStatus(404);
            return;
          }

          recipe.ingredients = ingredients.map(ingredient => ({
            id: ingredient.id,
            name: ingredient.name
          })).sort();
          return res.json(recipe);
        })
        .catch((err) => {
          res.status(500).json({
            message: err
          });
        });
}

// add comments above each function describing what they do.
function postRecipe(req, res) {
    // to insert into recipes table
  const name = req.swagger.params.recipe.value.name;
  const instructions = req.swagger.params.recipe.value.instructions;

    // to insert into recipe_ingredients table
  const ingredients = req.swagger.params.recipe.value.ingredients;
  let recipe;
  knex("recipes")
        .first().where("name", name)
        .then((result) => {
          if (result) {
            res.status(400).json("Recipe already exists!");
          } else {
            return knex("recipes").insert({
              name,
              instructions
            }).returning("*");
          }
        })
        .then((recipes) => {
          recipe = recipes[0];
          const data = ingredients.map(value => ({
            recipe_id: recipe.id,
            ingredient_id: value
          }));
          return knex("recipe_ingredients").insert(data).returning("*");
        })
        .then(() => doGetRecipe(recipe.id, res));
}
// take out code you're not using.

// add comments above each function describing what they do.
function updateRecipe(req, res) {
  const id = req.swagger.params.id.value;
  return knex("recipes")
   .update(req.swagger.params.recipe.value)
   .then(() => knex("recipes").where("id", id))
   .then((recipes) => {
     const recipe = recipes[0];
     res.json(recipe);
   });
}

function deleteRecipe(req, res) {
  const id = Number(req.swagger.params.id.value);
  return knex("recipes").where("id", id)
        .then((result) => {
          const recipe = result[0];
          delete recipe.id;
          res.json(recipe);
        })
        .then(() => {
          knex("recipes").where("id", id).del();
        });
}

// add comments above each function describing what they do.
function searchRecipes(req, res) {
    // To list clients
    // let text = req.swagger.params.text.value;
  return doGetRecipes(
      knex("recipes")
      .join("recipe_ingredients", "recipes.id", "recipe_ingredients.ingredient_id")
      .leftJoin("ingredient_tags", "recipe_ingredients.ingredient_id", "ingredient_tags.ingredient_id")
      .distinct("recipes.*")
      .where("name", "ilike", `%${req.swagger.params.text.value}%`)
      .orWhere("ingredient_tags.tag_text", "ilike", `%${req.swagger.params.text.value}%`), res);
}
