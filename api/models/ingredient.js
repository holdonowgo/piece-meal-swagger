const bookshelf = require('../../bookshelf');

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
    }
});

let Ingredients = bookshelf.Collection.extend({
    model: Ingredient
});

let IngredientTag = bookshelf.Model.extend({
    tableName: 'ingredient_tags',
    hasTimestamps: false,

    ingredient: function() {
        return this.belongsTo(Ingredient);
    }
});

let IngredientTags = bookshelf.Collection.extend({
    model: IngredientTag
});

module.exports = {
    Ingredient,
    IngredientTag,
    IngredientTags
}
