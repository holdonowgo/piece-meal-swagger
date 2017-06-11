const data = [{
    id: 1,
    recipe_id: 1,
    tag_text: 'vegetarian'
}, {
    id: 2,
    recipe_id: 1,
    tag_text: 'vegan'
}, {
    id: 3,
    recipe_id: 2,
    tag_text: 'vegetarian'
}, {
    id: 4,
    recipe_id: 3,
    tag_text: 'dairy'
}, {
    id: 5,
    recipe_id: 3,
    tag_text: 'vegetarian'
},{
    id: 6,
    recipe_id: 4,
    tag_text: 'vegetarian'
}, {
    id: 7,
    recipe_id: 4,
    tag_text: 'vegan'
}]

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('recipes_tags').del()
        .then(function() {
            //then insert the data
            return knex('recipes_tags').insert(data);
        })
        .then(function() {
            //update id to the maximum id using raw SQL
            return knex.raw("SELECT setval('recipes_tags_id_seq', (SELECT MAX(id) from recipes_tags));");
        });
};
