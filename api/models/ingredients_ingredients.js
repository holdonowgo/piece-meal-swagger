const bookshelf = require('../../bookshelf');
const Ingredient = require('../models/ingredient.js').Ingredient;
const Ingredients = require('../models/ingredient.js').Ingredients;


let AlternativeIngredient = bookshelf.Model.extend({
  tableName: 'ingredient_alternatives',
  hasTimestamps: false,
  idAttribute : ['alt_ingredient_id', 'ingredient_id']

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

let AlternativeIngredients = bookshelf.Collection.extend({
    model: AlternativeIngredient
});

module.exports = {
    AlternativeIngredient,
    AlternativeIngredients
}
