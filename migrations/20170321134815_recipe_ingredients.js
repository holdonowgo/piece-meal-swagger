exports.up = function(knex, Promise) {
  return knex.schema.createTable('recipe_ingredients', (table) => {
    table.increments('id').primary();
    //adding a recipe_id column to recipe_ingredients table referencing to recipe table at id column
    table.integer('recipe_id').references('recipes.id').onDelete('CASCADE').notNullable();
    table.integer('ingredient_id').references('ingredients.id').onDelete('CASCADE').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("recipe_ingredients");
};
