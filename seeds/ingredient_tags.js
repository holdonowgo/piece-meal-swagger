const data = [{
    id: 1,
    ingredient_id: 1,
    tag_text: 'pork'
}, {
    id: 2,
    ingredient_id: 1,
    tag_text: 'meat'
}, {
    id: 3,
    ingredient_id: 2,
    tag_text: 'vegetarian'
}, {
    id: 4,
    ingredient_id: 3,
    tag_text: 'dairy'
}, {
    id: 5,
    ingredient_id: 4,
    tag_text: 'vegetarian'
}, {
    id: 6,
    ingredient_id: 4,
    tag_text: 'vegan'
}]

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('ingredient_tags').del()
        .then(function() {
            //then insert the data
            return knex('ingredient_tags').insert(data);
        })
        .then(function() {
            //update id to the maximum id using raw SQL
            return knex.raw("SELECT setval('ingredient_tags_id_seq', (SELECT MAX(id) from ingredient_tags));");
        });
};
