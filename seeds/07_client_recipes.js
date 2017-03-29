const data = [{
    id: 1,
    recipe_id: 1,
    client_id: 1
}, {
    id: 2,
    recipe_id: 2,
    client_id: 1
}, {
    id: 3,
    recipe_id: 3,
    client_id: 1
}, {
    id: 4,
    recipe_id: 5,
    client_id: 4
}, {
    id: 5,
    recipe_id: 6,
    client_id: 4
}, {
    id: 6,
    recipe_id: 7,
    client_id: 4
}, {
    id: 7,
    recipe_id: 8,
    client_id: 3
}, {
    id: 8,
    recipe_id: 4,
    client_id: 3
}, {
    id: 9,
    recipe_id: 5,
    client_id: 3
}, {
    id: 10,
    recipe_id: 2,
    client_id: 3
}];

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('client_recipes').del()
        .then(function() {
            // Inserts seed entries
            return knex('client_recipes').insert(data);
        })
        .then(function() {
            return knex.raw("SELECT setval('client_recipes_id_seq', (SELECT MAX(id) from client_recipes));");
        });
};
