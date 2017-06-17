const data = [{
  client_id: 1,
  ingredient_id: 28
}, {
  client_id: 1,
  ingredient_id: 31
}, {
  client_id: 2,
  ingredient_id: 1
}, {
  client_id: 2,
  ingredient_id: 3
}, {
  client_id: 2,
  ingredient_id: 2
}, {
  client_id: 3,
  ingredient_id: 3
}, {
  client_id: 3,
  ingredient_id: 4
}, {
  client_id: 4,
  ingredient_id: 2
}, {
  client_id: 4,
  ingredient_id: 20
}, {
  client_id: 4,
  ingredient_id: 17
}, {
  client_id: 4,
  ingredient_id: 25
}, {
  client_id: 4,
  ingredient_id: 26
}, {
  client_id: 4,
  ingredient_id: 24
}, {
  client_id: 4,
  ingredient_id: 22
}];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('client_restrictions').del()
    .then(function() {
      // Inserts seed entries
      return knex('client_restrictions').insert(data);
    });
    // .then(function() {
    //   return knex.raw("SELECT setval('client_restrictions_id_seq', (SELECT MAX(id) from client_restrictions));");
    // });
};
