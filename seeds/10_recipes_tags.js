const data = [{
    id: 1,
    recipe_id: 1,
    tag_text: 'pork'
}, {
    id: 2,
    recipe_id: 1,
    tag_text: 'meat'
}, {
    id: 3,
    recipe_id: 2,
    tag_text: 'kosher'
}, {
    id: 4,
    recipe_id: 2,
    tag_text: 'vegetarian'
}, {
    id: 5,
    recipe_id: 2,
    tag_text: 'vegan'
}, {
    id: 6,
    recipe_id: 4,
    tag_text: 'kosher'
}, {
    id: 7,
    recipe_id: 3,
    tag_text: 'vegetarian'
}, {
    id: 8,
    recipe_id: 3,
    tag_text: 'kosher'
}, {
    id: 9,
    recipe_id: 5,
    tag_text: 'kosher'
}, {
    id: 10,
    recipe_id: 5,
    tag_text: 'seafood'
}, {
    id: 11,
    recipe_id: 5,
    tag_text: 'nuts'
}, {
    id: 12,
    recipe_id: 5,
    tag_text: 'wheat'
}, {
    id: 13,
    recipe_id: 5,
    tag_text: 'soy'
}, {
    id: 14,
    recipe_id: 9,
    tag_text: 'thai'
}, {
    id: 16,
    recipe_id: 9,
    tag_text: 'seafood'
}, {
    id: 18,
    recipe_id: 9,
    tag_text: 'nuts'
}, {
    id: 19,
    recipe_id: 9,
    tag_text: 'wheat'
}, {
    id: 20,
    recipe_id: 9,
    tag_text: 'soy'
}, {
    id: 21,
    recipe_id: 9,
    tag_text: 'legume'
}, {
    id: 23,
    recipe_id: 6,
    tag_text: 'vegan'
}, {
    id: 24,
    recipe_id: 6,
    tag_text: 'vegetarian'
}, {
    id: 25,
    recipe_id: 8,
    tag_text: 'vegan'
}, {
    id: 26,
    recipe_id: 8,
    tag_text: 'vegetarian'
}, {
    id: 27,
    recipe_id: 8,
    tag_text: 'kosher'
}, {
    id: 28,
    recipe_id: 8,
    tag_text: 'legume'
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
