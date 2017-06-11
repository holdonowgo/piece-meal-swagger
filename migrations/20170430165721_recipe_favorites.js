
exports.up = function(knex, Promise) {
    return knex.schema.createTable('recipe_favorites', (table) => {
        table.integer('recipe_id').references('recipes.id').onDelete('CASCADE').notNullable();
        table.integer('client_id').references('clients.id').onDelete('CASCADE').notNullable();
        table.primary(['client_id', 'recipe_id']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("recipe_favorites");
};
