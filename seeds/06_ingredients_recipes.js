const data = [{
  // id: 1,
  recipe_id: 2,
  ingredient_id: 1
}, {
  // id: 2,
  recipe_id: 3,
  ingredient_id: 1
}, {
  // id: 3,
  recipe_id: 1,
  ingredient_id: 1
}, {
  // id: 4,
  recipe_id: 1,
  ingredient_id: 3
}, {
  // id: 5,
  recipe_id: 4,
  ingredient_id: 17
}, {
  // id: 6,
  recipe_id: 4,
  ingredient_id: 18
}, {
  // id: 7,
  recipe_id: 5,
  ingredient_id: 21
}, {
  // id: 8,
  recipe_id: 5,
  ingredient_id: 22
}, {
  // id: 9,
  recipe_id: 5,
  ingredient_id: 23
}];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ingredients_recipes').del()
    .then(function() {
      // Inserts seed entries
      return knex('ingredients_recipes').insert(data);
    });
    // .then(function() {
    //   return knex.raw("SELECT setval('ingredients_recipes_id_seq', (SELECT MAX(id) from ingredients_recipes));");
    // });
};
