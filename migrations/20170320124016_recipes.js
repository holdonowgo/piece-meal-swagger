exports.up = function(knex, Promise) {
  return knex.schema.createTable('recipes', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().defaultTo('');
    table.text('description').defaultTo('');
    table.integer('prep_time');
    table.integer('cook_time');
    table.string('notes').defaultTo('');
    table.string('image_url').defaultTo('');
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('source_recipe_id').references('recipes.id');
    table.integer('created_by').references('clients.id').onDelete('CASCADE');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("recipes");
};
