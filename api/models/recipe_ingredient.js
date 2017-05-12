const bookshelf = require('../../bookshelf');
const Ingredient = require('../models/ingredient.js').Ingredient;
const Ingredients = require('../models/ingredient.js').Ingredients;


let RecipeIngredient = bookshelf.Model.extend({
  tableName: 'ingredients_recipes',
  hasTimestamps: false,
  // idAttribute : ['recipe_id', 'ingredient_id']

  // recipe: function() {
  //     return this.belongsTo(Recipe);
  // },

  // recipe: function() {
  //     return this.belongsTo(Recipe).through(RecipeIngredient);
  // },
  //
  // ingredient: function() {
  //     return this.belongsToMany(Ingredient).through(RecipeIngredient);
  // },

  // ingredient: function() {
  //   return this.belongsTo(Ingredient);
  // }
})

let RecipeIngredients = bookshelf.Collection.extend({
    model: RecipeIngredient
});

module.exports = {
    RecipeIngredient,
    RecipeIngredients
}
