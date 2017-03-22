exports.up = function(knex, Promise) {
  return knex.schema.createTable('client_restriction', (table) => {
    table.increments('id').primary();
    table.integer('client_id').references('clients.id').onDelete('CASCADE').notNullable();
    table.integer('ingredient_id').references('ingredients.id').onDelete('CASCADE').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("client_restriction");
};
