const data = [{
  // id: 1,
  recipe_id: 2,
  ingredient_id: 1
}, {
  // id: 2,
  recipe_id: 3,
  ingredient_id: 1
}, {
  recipe_id: 1,
  ingredient_id: 1
}, {
  recipe_id: 1,
  ingredient_id: 3
}, {
  recipe_id: 4,
  ingredient_id: 17
}, {
  recipe_id: 4,
  ingredient_id: 18
}, {
  recipe_id: 5,
  ingredient_id: 40
}, {
  recipe_id: 5,
  ingredient_id: 41
}, {
  recipe_id: 5,
  ingredient_id: 43
}, {
  recipe_id: 5,
  ingredient_id: 44
}, {
  recipe_id: 5,
  ingredient_id: 45
}, {
  recipe_id: 5,
  ingredient_id: 46
}, {
  recipe_id: 5,
  ingredient_id: 34
}, {
  recipe_id: 9,
  ingredient_id: 28,
  amount: '1 whole'
}, {
  recipe_id: 9,
  ingredient_id: 29,
  amount: '5 whole peeled'
}, {
  recipe_id: 9,
  ingredient_id: 30,
  amount: '2 whole'
}, {
  recipe_id: 9,
  ingredient_id: 31,
  amount: '2 Tbsp'
}, {
  recipe_id: 9,
  ingredient_id: 32,
  amount: '1 tsp grated'
}, {
  recipe_id: 9,
  ingredient_id: 33,
  amount: '2 cups'
}, {
  recipe_id: 9,
  ingredient_id: 34,
  amount: '1 Tbsp'
}, {
  recipe_id: 9,
  ingredient_id: 35,
  amount: '1 tsp'
}, {
  recipe_id: 9,
  ingredient_id: 36,
  amount: '1 cup'
}, {
  recipe_id: 9,
  ingredient_id: 37,
  amount: '1/2 cup'
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
