
exports.up = function(knex, Promise) {
    return knex.schema.createTable('recipes_votes', (table) => {
        table.integer('recipe_id').references('recipes.id').onDelete('CASCADE').notNullable();
        table.integer('client_id').references('clients.id').onDelete('CASCADE').notNullable();
        table.integer('vote');
        table.primary(['recipe_id', 'client_id']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("recipes_votes");
};
