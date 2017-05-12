exports.up = function(knex, Promise) {
    return knex.schema.createTable('ingredients_tags', (table) => {
        table.increments('id').primary();
        table.integer('ingredient_id').references('ingredients.id').onDelete('CASCADE').notNullable();
        table.string('tag_text').notNullable().defaultTo('');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("ingredients_tags");
};
