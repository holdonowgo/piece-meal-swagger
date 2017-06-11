const bookshelf = require('../../bookshelf');
const Recipe = require('../models/recipe.js').Recipe;
const Recipes = require('../models/recipe.js').Recipes;

let RecipeVote = bookshelf.Model.extend({
    tableName: 'recipes_votes',
    hasTimestamps: false,

    recipe: function() {
        return this.belongsTo(Recipe);
    }
});

let RecipeVotes = bookshelf.Collection.extend({
    model: RecipeVote
});

module.exports = {
    RecipeVote,
    RecipeVotes
}
