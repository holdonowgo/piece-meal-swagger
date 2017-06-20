'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/recipe.js').Recipe;
const Recipes = require('../models/recipe.js').Recipes;
const RecipeStep = require('../models/recipe.js').RecipeStep;
const RecipeSteps = require('../models/recipe.js').RecipeSteps;

module.exports = {
    getRecipesList: getRecipesList,
    getClientRecipes: getClientRecipes,
    addClientRecipe: addClientRecipe,
    getRecipe: getRecipe,
    postRecipe: postRecipe,
    updateRecipe: updateRecipe,
    deleteRecipe: deleteRecipe,
    searchRecipes: searchRecipes,
    rateRecipe: rateRecipe,
    getRandomRecipes: getRandomRecipes,
    getFavoriteRecipes: getFavoriteRecipes,
    getRecipeBookshelf: getRecipeBookshelf,
    getSafeRecipes: getSafeRecipes
};

function doGetRecipes(query, res) {
  return query.then((rows) => {
    let recipe_ids = rows.map((r) => r.id);
    return fetchRecipes(new Recipes()
      .query('whereIn', 'id', recipe_ids)
      .query('orderBy', 'name', 'asc'), res);
  }).done();
}

function getRecipesList(req, res) {
    return fetchRecipes(new Recipes()
        .query('where', 'active', true)
        .query('orderBy', 'name', 'asc'), res);
}

function getSafeRecipes(req, res) {
  let promises = [];

  promises.push(knex("ingredients_tags").select("ingredient_id", "tag_text"));

  promises.push(knex('ingredients').select('ingredients.id', 'ingredients.name', 'ingredients.description').join('client_restrictions', 'ingredients.id', 'ingredient_id').where('client_id', req.swagger.params.user_id.value));

  let recipePromise = new Recipes()
      .query('where', 'active', true)
      .query('orderBy', 'name', 'asc').fetch({
          withRelated: [
            { instructions: (query) => { query.orderBy('step_number'); }},
            'tags',
            'ingredients',
            'ingredients.alternatives',
            'ingredients.tags',
          ]
      });

  promises.push(recipePromise);

  Promise.all(promises).then((results) => {
      let tags = results[0];
      let ingredients = results[1];
      let recipes = results[2];

      for (let ingredient of ingredients) {
          ingredient.tags = tags.filter((tag) => {
              return tag.ingredient_id === ingredient.id;
          }).map((tag) => {
              return tag.tag_text;
          }).sort();
      }

      let recipeObjs = recipes.serialize();

      recipeObjs.sort((a, b) => {
        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        if(b.name.toLowerCase() > a.name.toLowerCase()) return -1;
        return 0;
      })

      for(let recipeObj of recipeObjs) {
        recipeObj.tags = recipeObj.tags.map((tag) => {
            return tag.tag_text;
        }).sort();

        for(let ingredient of recipeObj.ingredients) {
          ingredient.tags = ingredient.tags.map(tag => tag.tag_text).sort();
          ingredient.amount = ingredient._pivot_amount;
          delete ingredient._pivot_amount;
        }
      }

      let restrictionIds = ingredients.map((ingredient) => {
        return ingredient.id;
      })

      recipeObjs = recipeObjs.filter((recipe) => {
        let recipeIngredientIds = recipe.ingredients.map((ingredient) => {
          return ingredient.id;
        });

        let intersection = recipeIngredientIds.filter(function(n) {
            return restrictionIds.indexOf(n) !== -1;
        });

        return intersection.length === 0;
      })

      return res.json({ recipes: recipeObjs });

    }).catch((err) => {
      console.log("got error", err);
        res.status(500).json({message: err});
    });
}

function getFavoriteRecipes(req, res) {
    return doGetRecipes(
      knex("recipes")
      .where('recipes.active', true)
      .join("recipe_favorites", function () {
        this
          .on('recipe_favorites.recipe_id', 'recipes.id')
          .on('recipe_favorites.client_id', req.swagger.params.user_id.value);
      })
      .select("recipes.*")
      // .orderBy('recipes.id'), res);
      .orderByRaw('LOWER(recipes.name) ASC'), res);
}

function getClientRecipes(req, res) {

    const query = Recipes.query((qb) => {
      qb.innerJoin('clients_recipes', 'recipes.id', 'clients_recipes.recipe_id');
      qb.where('clients_recipes.client_id', req.swagger.params.user_id.value);
    });
    return fetchRecipes(query, res);

    // const query = knex("recipes").join('clients_recipes', 'clients_recipes.recipe_id', 'recipes.id').select("recipes.*").where('clients_recipes.client_id', req.swagger.params.user_id.value).orderByRaw('LOWER(recipes.name)');
    // return doGetRecipes(query, res);
}

function addClientRecipe(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }

        return knex("clients_recipes").insert({client_id: req.swagger.params.user_id.value, recipe_id: req.swagger.params.request.value.recipe_id}).then(() => {
            res.status(200).json({success: 1, description: "Added"});
        });
  });
}

function getIngredientsQuery(recipeId) {
    return knex("ingredients_recipes")
      .join("ingredients", "ingredients.id", "ingredients_recipes.ingredient_id")
      .select("ingredients.id",
              "ingredients.name",
              "ingredients.description",
              "ingredients.active",
              "ingredients.image_url",
              "ingredients_recipes.amount")
      .orderBy('id')
      .where("ingredients_recipes.recipe_id", recipeId);
}

function getIngredientTagsQuery(ingredientId) {
    return knex("ingredients_tags").where("ingredients_tags.ingredient_id", ingredientId).orderBy('tag_text');
}

function getRecipeStepsQuery(recipeId) {
    return knex("recipe_steps").join("recipes", "recipes.id", "recipe_steps.recipe_id").select("recipe_steps.step_number", "recipe_steps.instructions").orderBy('step_number').where("recipe_steps.recipe_id", recipeId);
}

function getRecipeTagsQuery(recipeId) {
    return knex("recipes_tags").join("recipes", "recipes.id", "recipes_tags.recipe_id").select("recipes_tags.tag_text").orderBy('tag_text').where("recipes_tags.recipe_id", recipeId);
}

function getRecipe(req, res) {
    return doGetRecipe(req.swagger.params.id.value, res);
}

function doGetRecipe(recipeId, res) {
    let recipe;
    let promises = [];
    promises.push(knex("recipes").select("id", "name", "description", "notes", "image_url", "active").first().where("id", recipeId));
    promises.push(getIngredientsQuery(recipeId));
    promises.push(getRecipeStepsQuery(recipeId));
    promises.push(getRecipeTagsQuery(recipeId));

    Promise.all(promises).then((results) => {
        recipe = results[0];
        let ingredients = results[1];
        let instructions = results[2];
        let tags = results[3];

        if (!recipe) {
            // res.set('Content-Type', 'application/json');
            // res.sendStatus(404);
            // return;
            return res.status(404).json('Not Found');
        } else {
          recipe.ingredients = ingredients;

          recipe.instructions = instructions;

          recipe.tags = tags.map((tag) => {
              return tag.tag_text;
          })

          let proms = recipe.ingredients.map(ingredient => getIngredientTagsQuery(ingredient.id));

          return Promise.all(proms);
        }
    }).then((result) => {

        for (let i = 0; i < recipe.ingredients.length; i++) {
            recipe.ingredients[i].tags = result[i].map(tag => tag.tag_text);
        }

        return res.status(200).json(recipe);
    }).catch((err) => {
        res.status(500).json({message: err});
    });
}

function rateRecipe(req, res) {
  jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
      if (err) {
          res.set('Content-Type', 'application/json');
          res.status(401).send('Unauthorized');
      } else {
        let recipe_id = req.swagger.params.recipe_id.value;
        let vote = req.swagger.params.vote.value.vote;
        let client_id = req.swagger.params.vote.value.client_id;

        knex("recipes_votes").first().where("recipe_id", recipe_id).andWhere("client_id", client_id).then((result) => {
            if (result) {
                return knex("recipes_votes")
                .where("recipe_id", recipe_id).andWhere("client_id", client_id)
                .update({vote: vote});
            } else {
                return knex("recipes_votes")
                .insert({"recipe_id": recipe_id, client_id: client_id, vote: vote});
            }
        })
        .then(() => {
          return doGetRecipe(recipe_id, res);
        });
      }
  });
}

function postRecipe(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }

        //to insert into recipes table
        let recipe;
        let name = req.swagger.params.recipe.value.name;
        let description = req.swagger.params.recipe.value.description;
        let image_url = req.swagger.params.recipe.value.image_url;

        // to insert into the recipe_steps table
        let instructions = req.swagger.params.recipe.value.instructions;

        //to insert into ingredients_recipes table
        let ingredients = req.swagger.params.recipe.value.ingredients;
        let tags = req.swagger.params.recipe.value.tags;
        knex("recipes").first().where("name", name).then((result) => {
            if (result) {
                return res.status(400).json("Recipe already exists!");
            } else {
                return knex("recipes").insert({"name": name,
                                               "description": description,
                                               "image_url": image_url})
                                               .returning("*");
            }
        }).then((recipes) => { // insert ingredients
            recipe = recipes[0];
            let data = ingredients.map((value) => {
                return {recipe_id: recipe.id, ingredient_id: value};
            });
            return knex('ingredients_recipes').insert(data).returning("*");
        }).then(() => { // insert instructions
            let data = instructions.map((step) => {
                return {recipe_id: recipe.id, step_number: step.step_number, instructions: step.instructions};
            });
            return knex('recipe_steps').insert(data).returning("*");
        }).then(() => { // insert instructions
            let data = tags.map((tag) => {
                return { recipe_id: recipe.id, tag_text: tag.toLowerCase() };
            });
            return knex('recipes_tags').insert(data).returning("*");
        }).then(() => { // return new recipe
            // return doGetRecipe(recipe.id, res);
            return fetchRecipe(recipe.id, res);
        });
  });
}

function updateRecipe(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }

        let id = req.swagger.params.id.value;
        let recipe = req.swagger.params.recipe.value;

        knex('recipes').where('id', id).del().then(() => {
            return knex("recipes").first().where("name", recipe.name);
        }).then((result) => {
            if (result) {
                return res.status(400).json("Recipe already exists!");
            } else {
                return knex("recipes").insert({"id": id, "name": recipe.name, description: recipe.description, notes: recipe.notes}).returning("*");
            }
        }).then((recipes) => {
            //to insert into ingredients_recipes table

            let data = recipe.ingredients.map((value) => {
                return {recipe_id: recipe.id, ingredient_id: value};
            });

            return knex('ingredients_recipes').insert(data).returning("*");
        }).then(() => {
            // to insert into the recipe_steps table

            let data = recipe.instructions.map((step) => {
                return {recipe_id: recipe.id, step_number: step.step_number, instructions: step.instructions};
            });

            return knex('recipe_steps').insert(data).returning("*");
        }).then(() => {
            // to insert into the recipe_steps table

            let data = recipe.tags.map((tag) => {
                return {recipe_id: recipe.id, tag_text: tag.toLowerCase()};
            });

            return knex('recipes_tags').insert(data).returning("*");
        }).then(() => { // return updated recipe
            return doGetRecipe(recipe.id, res);
        }).catch((err) => {
            console.log(err);
        });
  });
}

function deleteRecipe(req, res) {
    jwt.verify(req.headers['token'], process.env.JWT_KEY, (err, payload) => {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(401).send('Unauthorized');
        }

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
            return res.status(200).json(recipe)
        });
  });
}

function searchRecipes(req, res) {
    // To list clients
    // let text = req.swagger.params.text.value;
    return doGetRecipes(knex("recipes")
    .where('recipes.active', true)
    .join('ingredients_recipes', 'recipes.id', 'ingredients_recipes.recipe_id')
    .leftJoin('ingredients_tags', 'ingredients_recipes.ingredient_id', 'ingredients_tags.ingredient_id')
    .leftJoin('ingredients', 'ingredients_recipes.ingredient_id', 'ingredients.id')
    .distinct('recipes.*')
    .where('recipes.name', 'ilike', `%${req.swagger.params.text.value}%`)
    .orWhere('recipes.description', 'ilike', `%${req.swagger.params.text.value}%`)
    .orWhere('ingredients.name', 'ilike', `%${req.swagger.params.text.value}%`)
    .orWhere('ingredients_tags.tag_text', 'ilike', `%${req.swagger.params.text.value}%`)
    .orderBy('recipes.name'), res);
}

function fetchRecipe(id, res) {
  Recipe.forge({
           id: id
      })
      .fetch({
          // withRelated: ['steps', 'tags', 'ingredients']
          withRelated: [
            // 'instructions',
            { instructions: (query) => { query.orderBy('step_number'); }},
            'tags',
            // { tags: (query) => { query.column('tag_text'); }},
            'ingredients',
            'ingredients.alternatives',
            'ingredients.tags',
            // { 'ingredients.tags': (query) => { query.column('tag_text'); }}
          ]
      })
      .then((recipe) => {
        if(!recipe) {
          res.status(404).json('Not Found');
        } else {
          let recipeObj = recipe.serialize();
          // recipeObj.instructions = recipeObj.instructions.map((instruction) => {
          //     return instruction.instructions;
          // }).sort();
          recipeObj.tags = recipeObj.tags.map((tag) => {
              return tag.tag_text;
          }).sort();
          for(let ingredient of recipeObj.ingredients) {
            ingredient.tags = ingredient.tags.map(tag => tag.tag_text).sort();
            ingredient.amount = ingredient._pivot_amount;
            delete ingredient._pivot_amount;
          }

          return res.json(recipeObj);
        }
      }).catch((err) => {
          res.status(500).json({message: err});
      });
}

function fetchRecipes(query, res) {
  query.fetch({
          // withRelated: ['steps', 'tags', 'ingredients']
          withRelated: [
            // 'instructions',
            { instructions: (query) => { query.orderBy('step_number'); }},
            'tags',
            // { tags: (query) => { query.column('tag_text'); }},
            'ingredients',
            'ingredients.alternatives',
            'ingredients.tags',
            // { 'ingredients.tags': (query) => { query.column('tag_text'); }}
          ]
      })
      .then((recipes) => {
        if(!recipes) {
          res.status(404).json('Not Found');
        } else {
          let recipeObjs = recipes.serialize();

          recipeObjs.sort((a, b) => {
            if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            if(b.name.toLowerCase() > a.name.toLowerCase()) return -1;
            return 0;
          })

          for(let recipeObj of recipeObjs) {
            recipeObj.tags = recipeObj.tags.map((tag) => {
                return tag.tag_text;
            }).sort();

            for(let ingredient of recipeObj.ingredients) {
              ingredient.tags = ingredient.tags.map(tag => tag.tag_text).sort();
              ingredient.amount = ingredient._pivot_amount;
              delete ingredient._pivot_amount;
            }
          }

          return res.json({ recipes: recipeObjs });
        }
      }).catch((err) => {
        console.log("got error", err);
          res.status(500).json({message: err});
      });
}

function getRecipeBookshelf(req, res) {
  Recipe.forge({
           id: req.swagger.params.id.value
      })
      .fetch({
          // withRelated: ['steps', 'tags', 'ingredients']
          withRelated: [
            // 'instructions',
            { instructions: (query) => { query.orderBy('step_number'); }},
            'tags',
            // { tags: (query) => { query.column('tag_text'); }},
            'ingredients',
            'ingredients.alternatives',
            'ingredients.tags',
            // { 'ingredients.tags': (query) => { query.column('tag_text'); }}
          ]
      })
      .then((recipe) => {
        if(!recipe) {
          res.status(404).json('Not Found');
        } else {
          let recipeObj = recipe.serialize();
          // recipeObj.instructions = recipeObj.instructions.map((instruction) => {
          //     return instruction.instructions;
          // }).sort();
          recipeObj.tags = recipeObj.tags.map((tag) => {
              return tag.tag_text;
          }).sort();
          for(let ingredient of recipeObj.ingredients) {
            ingredient.tags = ingredient.tags.map(tag => tag.tag_text).sort();
          }

          return res.json(recipeObj);
        }
      }).catch((err) => {
          res.status(500).json({message: err});
      });
}

function getRandomRecipes(req, res) {
  return knex.raw('select * from recipes tablesample bernoulli (100) order by random() limit 10')
  .then((result) => {
    // console.log(result);
  })
  let query = knex.raw('select * from recipes tablesample bernoulli (100) order by random() limit 10');
  console.log(query.toString());
  return doGetRecipes(query, res);
  // return doGetRecipes(knex('recipes'), res);
}
