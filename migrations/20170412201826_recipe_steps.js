
exports.up = function(knex, Promise) {
  return knex.schema.createTable('recipe_steps', (table) => {
    table.increments('id').primary();
    table.integer('recipe_id').references('recipes.id').onDelete('CASCADE').notNullable();
    table.integer('step_number').notNullable();
    table.string('instructions').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("recipe_steps");
};
