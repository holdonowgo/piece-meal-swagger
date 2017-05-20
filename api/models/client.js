const bookshelf = require('../../bookshelf');
const Recipe = require('../models/recipe.js').Recipe;
const Recipes = require('../models/recipe.js').Recipes;
const Ingredient = require('../models/ingredient.js').Ingredient;
const Ingredients = require('../models/ingredient.js').Ingredients;

let Client = bookshelf.Model.extend({
    tableName: 'clients',
    hidden: ['hashed_password', 'created_at', 'updated_at'],
    hasTimestamps: true,

    recipes: function() {
      return this.belongsToMany(Recipe);
    },

    // favorite_recipes: function() {
    //   return this.belongsToMany(Recipe, 'recipe_favorites', 'recipe_id', 'client_id');
    // },

    restrictions: function() {
      return this.belongsToMany(
        Ingredient,
        'client_restrictions',
        'client_id',
        'ingredient_id');
    }
});

let Clients = bookshelf.Collection.extend({
    model: Client
});

module.exports = {
    Client,
    Clients
}
