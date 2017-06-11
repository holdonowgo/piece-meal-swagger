exports.up = function(knex, Promise) {
  return knex.schema.createTable('ingredients_recipes', (table) => {
    // table.increments('id').primary();
    //adding a recipe_id column to ingredients_recipes table referencing to recipe table at id column
    table.integer('recipe_id').references('recipes.id').onDelete('CASCADE').notNullable();
    table.integer('ingredient_id').references('ingredients.id').onDelete('CASCADE').notNullable();
    table.string('amount');
    table.primary(['recipe_id', 'ingredient_id']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("ingredients_recipes");
};
