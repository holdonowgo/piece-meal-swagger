exports.up = function(knex, Promise) {
    return knex.schema.createTable('clients', (table) => {
        table.increments('id').primary();
        table.string('first_name').notNullable().defaultTo('');
        table.string('last_name').notNullable().defaultTo('');
        table.string('email').notNullable().unique();
        table.boolean('is_super_user').notNullable().defaultTo(false);
        table.specificType('hashed_password', 'char(60)').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('clients');
};
