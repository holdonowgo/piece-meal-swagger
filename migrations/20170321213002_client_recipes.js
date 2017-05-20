exports.up = function(knex, Promise) {
    return knex.schema.createTable('clients_recipes', (table) => {
        // table.increments('id').primary();
        table.integer('client_id').references('clients.id').onDelete('CASCADE').notNullable();
        table.integer('recipe_id').references('recipes.id').onDelete('CASCADE').notNullable();
        table.primary(['client_id', 'recipe_id']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("clients_recipes");
};
