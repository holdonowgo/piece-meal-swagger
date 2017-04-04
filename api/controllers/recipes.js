'use strict';
const knex = require('../../knex');

module.exports = {
    getRecipesList: getRecipesList,
    getClientRecipes: getClientRecipes,
    addClientRecipe: addClientRecipe,
    getRecipe: getRecipe,
    postRecipe: postRecipe,
    updateRecipe: updateRecipe,
    deleteRecipe: deleteRecipe,
    searchRecipes: searchRecipes
};

function doGetRecipes(query, res) {
    let recipes;
    return query.then((rows) => {
        recipes = rows;
        let promises = rows.map((recipe) => getIngredientsQuery(recipe.id));
        return Promise.all(promises);
    }).then((promiseResults) => {
        // 'recipes' is an array of the recipes
        // 'promiseResults' is an array of arrays of ingredients
        for (var i = 0; i < recipes.length; i++) {
            recipes[i].ingredients = promiseResults[i];
        }
        return res.json({
            recipes: recipes
        });
    });
}

// /recipes
function getRecipesList(req, res) {
    return doGetRecipes(knex("recipes"), res);
}

function getClientRecipes(req, res) {
    const query = knex("recipes")
        .join('client_recipes', 'client_recipes.recipe_id', 'recipes.id')
        .select("recipes.*")
        .where('client_recipes.client_id', req.swagger.params.user_id.value);
    return doGetRecipes(query, res);
}

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

function getIngredientsQuery(recipeId) {
    return knex("recipe_ingredients")
        .join("ingredients", "ingredients.id", "recipe_ingredients.ingredient_id")
        .select("ingredients.*")
        .orderBy('id')
        .where("recipe_ingredients.recipe_id", recipeId);
}

function getRecipe(req, res) {
    return doGetRecipe(req.swagger.params.id.value, res);
}

function doGetRecipe(recipeId, res) {
    let promises = [];
    promises.push(
        knex("recipes")
        .select("id", "name", "instructions")
        .first()
        .where("id", recipeId)
    );
    promises.push(getIngredientsQuery(recipeId));
    Promise.all(promises)
        .then((results) => {
            let recipe = results[0];
            let ingredients = results[1];

            if (!recipe) {
                res.set('Content-Type', 'application/json');
                res.sendStatus(404);
                return;
            }

            recipe.ingredients = ingredients.map((ingredient) => {
                return {
                    id: ingredient.id,
                    name: ingredient.name,
                };
            }).sort();
            return res.json(recipe);
        })
        .catch((err) => {
            res.status(500).json({
                message: err
            });
        });
}

function postRecipe(req, res) {
    //to insert into recipes table
    let name = req.swagger.params.recipe.value.name;
    let instructions = req.swagger.params.recipe.value.instructions;

    //to insert into recipe_ingredients table
    let ingredients = req.swagger.params.recipe.value.ingredients;
    let recipe;
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
            recipe = recipes[0];
            let data = ingredients.map((value) => {
                return {
                    recipe_id: recipe.id,
                    ingredient_id: value
                };
            });
            return knex('recipe_ingredients').insert(data).returning("*");
        })
        .then(() => {
            return doGetRecipe(recipe.id, res);
        });
}
//to insert into recipe_ingredients table

// function updateRecipe(req, res) {
//     let id = req.swagger.params.id.value;
//     let ingredients = req.swagger.params.recipe.value.ingredients;
//     return knex('recipes')
//         .update(req.swagger.params.recipe.value)
//         .then(() => {
//             return knex('recipes').first().where('id', id);
//         })
//         .then((recipe) => {
//             let promises = [];
//             let data = ingredients.map((value) => {
//                 return {
//                     recipe_id: recipe.id,
//                     ingredient_id: value
//                 };
//             });
//             promises.push(
//                 knex('recipe_ingredients').where('recipe_id', recipe.id).del()
//             );
//             console.log('did delete');
//             promises.push(
//                 knex('recipe_ingredients').insert(data).returning("*")
//             );
//             console.log('did insert');
//
//             return promises;
//         })
//         .then((result) => {
//             return knex('recipes').first().where('id', id);
//         })
//         .then((recipe) => {
//             // let recipe = recipes[0];
//             return res.json(recipe);
//         });
// }

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

function searchRecipes(req, res) {
    // To list clients
    // let text = req.swagger.params.text.value;
    return doGetRecipes(
      knex("recipes")
      .join('recipe_ingredients', 'recipes.id', 'recipe_ingredients.ingredient_id')
      .join('ingredient_tags', 'recipe_ingredients.ingredient_id', 'ingredient_tags.ingredient_id')
      .distinct('recipes.*')
      .where('name', 'ilike', `%${req.swagger.params.text.value}%`)
      .orWhere('ingredient_tags.tag_text', 'ilike', `%${req.swagger.params.text.value}%`), res);
}
