const data = [{
  id: 1,
  recipe_id: 2,
  ingredient_id: 1
}, {
  id: 2,
  recipe_id: 3,
  ingredient_id: 1
}, {
  id: 3,
  recipe_id: 1,
  ingredient_id: 1
}, {
  id: 4,
  recipe_id: 1,
  ingredient_id: 3
}];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('recipe_ingredients').del()
    .then(function() {
      // Inserts seed entries
      return knex('recipe_ingredients').insert(data);
    })
    .then(function() {
      return knex.raw("SELECT setval('recipe_ingredients_id_seq', (SELECT MAX(id) from recipe_ingredients));");
    });
};
