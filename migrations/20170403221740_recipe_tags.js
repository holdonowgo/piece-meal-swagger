exports.up = function(knex, Promise) {
    return knex.schema.createTable('recipes_tags', (table) => {
        table.increments('id').primary();
        table.integer('recipe_id').references('recipes.id').onDelete('CASCADE').notNullable();
        table.string('tag_text').notNullable().defaultTo('');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("recipes_tags");
};
