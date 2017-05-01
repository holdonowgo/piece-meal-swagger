const data = [{
    id: 1,
    client_id: 1,
    recipe_id: 1
}, {
    id: 2,
    client_id: 1,
    recipe_id: 3
}, {
    id: 3,
    client_id: 1,
    recipe_id: 5
}, {
    id: 4,
    client_id: 3,
    recipe_id: 8
}, {
    id: 5,
    client_id: 4,
    recipe_id: 7
},{
    id: 6,
    client_id: 4,
    recipe_id: 6
}, {
    id: 7,
    client_id: 2,
    recipe_id: 2
}]

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('recipe_favorites').del()
        .then(function() {
            //then insert the data
            return knex('recipe_favorites').insert(data);
        })
        .then(function() {
            //update id to the maximum id using raw SQL
            return knex.raw("SELECT setval('recipe_favorites_id_seq', (SELECT MAX(id) from recipe_favorites));");
        });
};
