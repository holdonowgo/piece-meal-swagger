const bookshelf = require('../../bookshelf');
const Ingredient = require('../models/ingredient.js').Ingredient;
const Ingredients = require('../models/ingredient.js').Ingredients;
const RecipeIngredient = require('../models/recipe_ingredient.js').RecipeIngredient;
const RecipeStep = require('../models/recipe_step.js').RecipeStep;
const RecipeTag = require('../models/recipe_tag.js').RecipeTag;
const RecipeTags = require('../models/recipe_tag.js').RecipeTags;
const RecipeVote = require('../models/recipe_vote.js').RecipeVote;
const RecipeVotes = require('../models/recipe_vote.js').RecipeVotes;
const Client = require('../models/client.js').Client;
const Clients = require('../models/client.js').Clients;

let Recipe = bookshelf.Model.extend({
    tableName: 'recipes',
    idAttribute: 'id',
    visible: ['name', 'description', 'prep_time', 'cook_time', 'notes', 'image_url', 'ingredients', 'instructions', 'tags', 'votes'],
    hasTimestamps: true,

    clients: function() {
      return this.belongsToMany(
        Client,
        'clients_recipes',
        'recipe_id',
        'client_id');
    },

    // clients_favorites: function() {
    //   return this.belongsToMany(
    //     Client,
    //     'recipe_favorites',
    //     'client_id',
    //     'recipe_id');
    // },

    ingredients: function() {
      return this.belongsToMany(
        Ingredient,
        'ingredients_recipes',
        'recipe_id',
        'ingredient_id');
    },

    instructions: function() {
        return this.hasMany(RecipeStep);
    },

    tags: function() {
        return this.hasMany(RecipeTag);
    },

    votes: function() {
      return this.hasMany(RecipeVote);
      // bookshelf.knex('recipes_votes')
      // .sum('vote')
      // .where('recipe_id', this.get('id'))
      // .groupBy('recipe_id')
      // .then(function (result) {
      //   // cb(null, sum)
      //   console.log('SUM:', result[0].sum);
      //   return result[0].sum;
      // })
      // .catch(function (err) {
      //   // cb(err)
      //   console.log('THERE WAS AN ERROR:', err);
      // });
    }
});

let Recipes = bookshelf.Collection.extend({
    model: Recipe
});

module.exports = {
    Recipe,
    Recipes
}
