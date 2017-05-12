const bookshelf = require('../../bookshelf');

let IngredientTag = bookshelf.Model.extend({
    tableName: 'ingredients_tags',
    hasTimestamps: false,

    ingredient: function() {
        return this.belongsTo(Ingredient);
    }
});

let IngredientTags = bookshelf.Collection.extend({
    model: IngredientTag
});

module.exports = {
    IngredientTag,
    IngredientTags
}
