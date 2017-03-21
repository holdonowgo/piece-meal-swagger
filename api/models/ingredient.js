const bookshelf = require('../../bookshelf');

var Ingredient = bookshelf.Model.extend({
  tableName: 'ingredients',
  hasTimestamps: true,

  tags: function() {
    return this.hasMany(IngredientTag);
  },
  // alternatives: function() {
  //   return this.hasMany(Ingredient);
  // }
});

var Ingredients = bookshelf.Collection.extend({
    model: Ingredient
});

var IngredientTag = bookshelf.Model.extend({
  tableName: 'ingredient_tags',
  hasTimestamps: false,

  ingredient: function() {
    return this.belongsTo(Ingredient);
  }
});

var IngredientTags = bookshelf.Collection.extend({
    model: IngredientTag
});

module.exports ={
  Ingredient,
  IngredientTag,
  IngredientTags
}
