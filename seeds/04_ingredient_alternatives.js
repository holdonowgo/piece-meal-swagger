const data = [{
    ingredient_id: 1,
    alt_ingredient_id: 2
}, {
    ingredient_id: 1,
    alt_ingredient_id: 3
}, {
    ingredient_id: 3,
    alt_ingredient_id: 5
}, {
    ingredient_id: 3,
    alt_ingredient_id: 6
}, {
    ingredient_id: 18,
    alt_ingredient_id: 17
}, {
    ingredient_id: 25,
    alt_ingredient_id: 27
}, {
    ingredient_id: 26,
    alt_ingredient_id: 27
}, {
    ingredient_id: 28,
    alt_ingredient_id: 39
}, {
    ingredient_id: 31,
    alt_ingredient_id: 38
}]

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ingredient_alternatives').del()
      .then(function() {
          //then insert the data
          return knex('ingredient_alternatives').insert(data);
      });
      // .then(function() {
      //     //update id to the maximum id using raw SQL
      //     return knex.raw("SELECT setval('ingredient_alternatives_id_seq', (SELECT MAX(id) from ingredient_alternatives));");
      // });
};
