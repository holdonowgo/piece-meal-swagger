const bookshelf = require('../../bookshelf');
const Recipe = require('../models/recipe.js').Recipe;
const Ingredient = require('../models/ingredient.js').Ingredient;
const Ingredients = require('../models/ingredient.js').Ingredients;
const RecipeIngredient = require('../models/recipe_ingredient.js').RecipeIngredient;


let RecipeStep = bookshelf.Model.extend({
    tableName: 'recipe_steps',
    hasTimestamps: false,

    // recipe: function() {
    //     return this.belongsTo(Recipe);
    // },

    chapter: function() {
      return this.belongsTo(RecipeIngredient);
    },

    // A reverse relation, where we can get the book from the chapter.
    recipe: function() {
      return this.belongsTo(Recipe).through(RecipeIngredient);
    }
});

let RecipeSteps = bookshelf.Collection.extend({
    model: RecipeStep
});

module.exports = {
    RecipeStep,
    RecipeSteps
}
