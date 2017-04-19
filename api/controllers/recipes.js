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
    let ingredients;
    return query.then((rows) => {
        recipes = rows;
        let promises = rows.map((recipe) => getIngredientsQuery(recipe.id));
        return Promise.all(promises);
    }).then((promiseResults) => {
        // 'recipes' is an array of the recipes
        // 'promiseResults' is an array of arrays of ingredients
        let promises;

        for (var i = 0; i < recipes.length; i++) {
            recipes[i].ingredients = promiseResults[i].map((ingredient) => {
                delete ingredient.created_at;
                delete ingredient.updated_at;
                return ingredient;
            });

            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                let tags = [];
                if (recipes[i]) {
                    getIngredientTagsQuery(recipes[i].ingredients[j].id).then((promiseValue) => {
                        tags = promiseValue.map(tag => tag.tag_text);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
                recipes[i].ingredients[j].tags = tags;
            }
        }
        // console.log('ingredients:', ingredients);
        // console.log('promiseResults[0]:', promiseResults[0]);
        // let promises = promiseResults[0].map((ingredient) => getIngredientTagsQuery(ingredient.id));
        // let promises = promiseResults.map((ingredients) => {
        //   console.log('ingredients:', ingredients);
        //   return ingredients.map((ingredient) => {
        //     return getIngredientTagsQuery(ingredient.id);
        //   })
        // })
        //
        // return Promise.all(promises);
    }).then(() => {

        let promises = recipes.map((recipe) => getRecipeStepsQuery(recipe.id));

        return Promise.all(promises);
    }).then((promiseResults) => {

        for (var i = 0; i < recipes.length; i++) {
            recipes[i].instructions = promiseResults[i];
        }

        return res.json({recipes: recipes});
    });
}

// /recipes
function getRecipesList(req, res) {
    return doGetRecipes(knex("recipes"), res);
}

function getClientRecipes(req, res) {
    const query = knex("recipes").join('client_recipes', 'client_recipes.recipe_id', 'recipes.id').select("recipes.*").where('client_recipes.client_id', req.swagger.params.user_id.value);
    return doGetRecipes(query, res);
}

function addClientRecipe(req, res) {
    return knex("client_recipes").insert({client_id: req.swagger.params.user_id.value, recipe_id: req.swagger.params.request.value.recipe_id}).then(() => {
        res.json({success: 1, description: "Added"});
    });
}

function getIngredientsQuery(recipeId) {
    return knex("recipe_ingredients").join("ingredients", "ingredients.id", "recipe_ingredients.ingredient_id").select("ingredients.*").orderBy('id').where("recipe_ingredients.recipe_id", recipeId);
}

function getIngredientTagsQuery(ingredientId) {
    return knex("ingredient_tags").where("ingredient_tags.ingredient_id", ingredientId).orderBy('tag_text');
}

function getRecipeStepsQuery(recipeId) {
    return knex("recipe_steps").join("recipes", "recipes.id", "recipe_steps.recipe_id").select("recipe_steps.step_number", "recipe_steps.instructions").orderBy('step_number').where("recipe_steps.recipe_id", recipeId);
}

function getRecipe(req, res) {
    return doGetRecipe(req.swagger.params.id.value, res);
}

function doGetRecipe(recipeId, res) {
    let recipe;
    let promises = [];
    promises.push(knex("recipes").select("id", "name", "description").first().where("id", recipeId));
    promises.push(getIngredientsQuery(recipeId));
    promises.push(getRecipeStepsQuery(recipeId));

    Promise.all(promises).then((results) => {
        recipe = results[0];
        let ingredients = results[1];
        let instructions = results[2];

        if (!recipe) {
            res.set('Content-Type', 'application/json');
            res.sendStatus(404);
            return;
        }

        recipe.ingredients = ingredients.map((ingredient) => {
            return {id: ingredient.id, name: ingredient.name};
        }).sort();

        recipe.instructions = instructions.map((instruction) => {
            return {step_number: instruction.step_number, instructions: instruction.instructions};
        }).sort((a, b) => {
            return a.step_number - b.step_number;
        });

        let proms = recipe.ingredients.map(ingredient => getIngredientTagsQuery(ingredient.id));

        return Promise.all(proms);
    }).then((result) => {

        for (let i = 0; i < recipe.ingredients.length; i++) {
            recipe.ingredients[i].tags = result[i].map(tag => tag.tag_text);
        }

        return res.json(recipe);
    }).catch((err) => {
        res.status(500).json({message: err});
    });
}

function postRecipe(req, res) {
    //to insert into recipes table
    let recipe;
    let name = req.swagger.params.recipe.value.name;
    let description = req.swagger.params.recipe.value.description;

    // to insert into the recipe_steps table
    let instructions = req.swagger.params.recipe.value.instructions;

    //to insert into recipe_ingredients table
    let ingredients = req.swagger.params.recipe.value.ingredients;
    knex("recipes").first().where("name", name).then((result) => {
        if (result) {
            res.status(400).json("Recipe already exists!");
        } else {
            return knex("recipes").insert({"name": name, description: description}).returning("*");
        }
    }).then((recipes) => { // insert ingredients
        recipe = recipes[0];
        let data = ingredients.map((value) => {
            return {recipe_id: recipe.id, ingredient_id: value};
        });
        return knex('recipe_ingredients').insert(data).returning("*");
    }).then(() => { // insert instructions
        let data = instructions.map((step) => {
            return {recipe_id: recipe.id, step_number: step.step_number, instructions: step.instructions};
        });
        return knex('recipe_steps').insert(data).returning("*");
    }).then(() => { // return new recipe
        return doGetRecipe(recipe.id, res);
    });
}

function updateRecipe(req, res) {
    let id = req.swagger.params.id.value;
    let recipe = req.swagger.params.recipe.value;

    knex('recipes').where('id', id).del().then(() => {
        return knex("recipes").first().where("name", recipe.name);
    }).then((result) => {
        if (result) {
            res.status(400).json("Recipe already exists!");
        } else {
            return knex("recipes").insert({"id": id, "name": recipe.name, description: recipe.description}).returning("*");
        }
    }).then((recipes) => {
        //to insert into recipe_ingredients table

        let data = recipe.ingredients.map((value) => {
            return {recipe_id: recipe.id, ingredient_id: value};
        });

        return knex('recipe_ingredients').insert(data).returning("*");
    }).then(() => {
        // to insert into the recipe_steps table

        let data = recipe.instructions.map((step) => {
            return {recipe_id: recipe.id, step_number: step.step_number, instructions: step.instructions};
        });

        return knex('recipe_steps').insert(data).returning("*");
    }).then(() => { // return updated recipe
        return doGetRecipe(recipe.id, res);
    }).catch((err) => {
        console.log(err);
    });
}

function deleteRecipe(req, res) {
    let id = Number(req.swagger.params.id.value);
    // return knex('recipes').where('id', id).then((result) => {
    //     let recipe = result[0];
    //     delete recipe.id;
    //     res.json(recipe);
    // }).then(() => {
    //     knex('recipes').where('id', id).del();
    // });
    knex('recipes').where('id', id).update({active: false}).then(() => {
        return knex('recipes').select('id', 'name', 'active').first().where('id', id);
    }).then((recipe) => {
        return res.json(recipe)
    });
}

function searchRecipes(req, res) {
    // To list clients
    // let text = req.swagger.params.text.value;
    return doGetRecipes(knex("recipes").join('recipe_ingredients', 'recipes.id', 'recipe_ingredients.recipe_id').leftJoin('ingredient_tags', 'recipe_ingredients.ingredient_id', 'ingredient_tags.ingredient_id').leftJoin('ingredients', 'recipe_ingredients.ingredient_id', 'ingredients.id').distinct('recipes.*').where('recipes.name', 'ilike', `%${req.swagger.params.text.value}%`).orWhere('description', 'ilike', `%${req.swagger.params.text.value}%`).orWhere('ingredients.name', 'ilike', `%${req.swagger.params.text.value}%`).orWhere('ingredient_tags.tag_text', 'ilike', `%${req.swagger.params.text.value}%`), res);
}
