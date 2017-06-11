const data = [{
    recipe_id: 1,
    client_id: 1,
    vote: 1
}, {
    recipe_id: 1,
    client_id: 2,
    vote: 1
}, {
    recipe_id: 1,
    client_id: 3,
    vote: -1
}, {
    recipe_id: 2,
    client_id: 1,
    vote: -1
}, {
    recipe_id: 2,
    client_id: 3,
    vote: -1
},{
    recipe_id: 4,
    client_id: 3,
    vote: 1
}, {
    recipe_id: 4,
    client_id: 4,
    vote: -1
}, {
    recipe_id: 5,
    client_id: 4,
    vote: 1
}, {
    recipe_id: 6,
    client_id: 4,
    vote: -1
}, {
    recipe_id: 7,
    client_id: 4,
    vote: 1
}]

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('recipes_votes').del()
        .then(function() {
            //then insert the data
            return knex('recipes_votes').insert(data);
        });
};
