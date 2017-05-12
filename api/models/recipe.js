const bookshelf = require('../../bookshelf');
const Ingredient = require('../models/ingredient.js').Ingredient;
const Ingredients = require('../models/ingredient.js').Ingredients;
const RecipeIngredient = require('../models/recipe_ingredient.js').RecipeIngredient;
const RecipeStep = require('../models/recipe_step.js').RecipeStep;
const RecipeTag = require('../models/recipe_tag.js').RecipeTag;

let Recipe = bookshelf.Model.extend({
    tableName: 'recipes',
    hasTimestamps: true,

    // ingredients: function() {
    //     return this.belongsToMany(Ingredient);
    // },

    // ingredients: function() {
    //     return this.belongsToMany(
    //       Ingredient,
    //       'ingredients_recipes',
    //       'ingredient_id',
    //       'recipe_id');
    // },

    // ingredients_recipes: function () {
    //   return this.hasMany('RecipeIngredient');
    // },
    //
    // ingredients: function () {
    //   return this.hasMany('Ingredients').through('RecipeIngredient');
    // },

    ingredients: function() {
      return this.belongsToMany(Ingredient,
      'ingredients_recipes',
      'ingredients.id',
      'ingredients_recipes.ingredient_id');
    },

    // ingredients_recipes: function() {
    //   return this.hasMany(RecipeIngredient);
    // },

    instructions: function() {
        return this.hasMany(RecipeStep);
    },

    tags: function() {
        return this.hasMany(RecipeTag);
    }
});

let Recipes = bookshelf.Collection.extend({
    model: Recipe
});

module.exports = {
    Recipe,
    Recipes
}
