const data = [{
    id: 1,
    ingredient_id: 1,
    alt_ingredient_id: 2
}, {
    id: 2,
    ingredient_id: 1,
    alt_ingredient_id: 3
}]
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ingredient_alternatives').del()
      .then(function() {
          //then insert the data
          return knex('ingredient_alternatives').insert(data);
      })
      .then(function() {
          //update id to the maximum id using raw SQL
          return knex.raw("SELECT setval('ingredient_alternatives_id_seq', (SELECT MAX(id) from ingredient_alternatives));");
      });
};
