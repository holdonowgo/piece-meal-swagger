const data = [{
    id: 1,
    ingredient_id: 1,
    alt_ingredient_id: 2
}, {
    id: 2,
    ingredient_id: 1,
    alt_ingredient_id: 3
}, {
    id: 3,
    ingredient_id: 3,
    alt_ingredient_id: 5
}, {
    id: 4,
    ingredient_id: 3,
    alt_ingredient_id: 6
}, {
    id: 5,
    ingredient_id: 18,
    alt_ingredient_id: 17
}
, {
    id: 6,
    ingredient_id: 25,
    alt_ingredient_id: 27
}
, {
    id: 7,
    ingredient_id: 26,
    alt_ingredient_id: 27
}
// , {
//     id: 0,
//     ingredient_id: 0,
//     alt_ingredient_id: 0
// }
// , {
//     id: 0,
//     ingredient_id: 0,
//     alt_ingredient_id: 0
// }
// , {
//     id: 0,
//     ingredient_id: 0,
//     alt_ingredient_id: 0
// }
// ,
// {
//     id: 0,
//     ingredient_id: 0,
//     alt_ingredient_id: 0
// }
]
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
