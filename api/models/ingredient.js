const bookshelf = require('../../bookshelf');
const Recipe = require('../models/recipe.js').Recipe;
const Recipes = require('../models/recipe.js').Recipes;
const Client = require('../models/client.js').Client;
const Clients = require('../models/client.js').Clients;
const RecipeIngredient = require('../models/recipe_ingredient.js').RecipeIngredient;
const IngredientTag = require('../models/ingredient_tag.js').IngredientTag;

let Ingredient = bookshelf.Model.extend({
    tableName: 'ingredients',
    hidden: ['created_at', 'updated_at', '_pivot_ingredient_id', '_pivot_recipe_id', '_pivot_client_id', '_pivot_alt_ingredient_id'],
    hasTimestamps: true,
    // virtuals: {
    //   allTags: {
    //       get: function () {
    //           return this.get('tags')
    //       }
    //     }
    // },
    initialize: function () {
      this.on('saved', function (model, attributes, options) {
        // console.log('model:', model);
        // console.log('attributes:', attributes);
        // console.log('options:', options);
        if (options.withRelated) {
          if (!Array.isArray(options.withRelated)) options.withRelated = [options.withRelated];
          return Promise.map(options.withRelated, function (name) {
            if (model.related(name).hasChanged()) {
              return model.related(name).save();
            }
          });
        }
      });
    },

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
      return this.belongsToMany(
        Recipe,
        'ingredients_recipes',
        'ingredient_id',
        'recipe_id');
    },

    restricted_clients: function() {
      return this.belongsToMany(
        Client,
        'client_restrictions',
        'client_id',
        'ingredient_id');
    }
});

let Ingredients = bookshelf.Collection.extend({
    model: Ingredient
});


module.exports = {
    Ingredient,
    Ingredients
}
