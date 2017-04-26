const bookshelf = require('../../bookshelf');
const Recipe = require('../models/recipe.js').Recipe;
const Recipes = require('../models/recipe.js').Recipes;
const RecipeIngredient = require('../models/recipe_ingredient.js').RecipeIngredient;
const IngredientTag = require('../models/ingredient_tag.js').IngredientTag;

let Ingredient = bookshelf.Model.extend({
    tableName: 'ingredients',
    hasTimestamps: true,

    tags: function() {
        return this.hasMany(IngredientTag);
    },

    alternatives: function() {
        return this.belongsToMany(
          Ingredient,
          'ingredient_alternatives',
          'ingredient_id',
          'alt_ingredient_id');
    },

    recipes: function() {
      return this.belongsToMany(Recipe,
      'recipe_ingredients',
      'recipes.id',
      'recipe_ingredients.recipe_id');
    },

    // recipe_ingredients: function() {
    //   return this.belongsToMany(RecipeIngredient);
    // }
});

let Ingredients = bookshelf.Collection.extend({
    model: Ingredient
});


module.exports = {
    Ingredient,
    Ingredients
}
