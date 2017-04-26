const bookshelf = require('../../bookshelf');
const Recipe = require('../models/recipe.js').Recipe;
const Recipes = require('../models/recipe.js').Recipes;

let RecipeTag = bookshelf.Model.extend({
    tableName: 'recipe_tags',
    hasTimestamps: false,

    recipe: function() {
        return this.belongsTo(Recipe);
    }
});

let RecipeTags = bookshelf.Collection.extend({
    model: RecipeTag
});

module.exports = {
    RecipeTag,
    RecipeTags
}
