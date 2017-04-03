
exports.up = function(knex, Promise) {
    return knex.schema.createTable('ingredient_alternatives', (table) => {
        // table.increments('id').primary();
        table.integer('ingredient_id').references('ingredients.id').onDelete('CASCADE').notNullable();
        table.integer('alt_ingredient_id').references('ingredients.id').onDelete('CASCADE').notNullable();
        table.primary(['ingredient_id', 'alt_ingredient_id']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("ingredient_alternatives");
};
