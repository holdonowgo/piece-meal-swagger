exports.up = function(knex, Promise) {
  return knex.schema.createTable('recipes', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().defaultTo('');
    table.text('description').defaultTo('');
    table.string('notes').defaultTo('');
    table.string('image_url').defaultTo('');
    table.boolean('active').notNullable().defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("recipes");
};
