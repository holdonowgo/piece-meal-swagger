const bookshelf = require('../../bookshelf');

let IngredientTag = bookshelf.Model.extend({
    tableName: 'ingredients_tags',
    visible: ['tag_text'],
    hidden: ['id', 'ingredient_id'],
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
