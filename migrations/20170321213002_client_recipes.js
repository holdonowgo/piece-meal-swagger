exports.up = function(knex, Promise) {
    return knex.schema.createTable('client_recipes', (table) => {
        table.increments('id').primary();
        table.integer('client_id').references('clients.id').onDelete('CASCADE').notNullable();
        table.integer('recipe_id').references('recipes.id').onDelete('CASCADE').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("client_recipes");
};
