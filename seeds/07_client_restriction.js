const data = [{
  id: 1,
  client_id: 2,
  ingredient_id: 1
}, {
  id: 2,
  client_id: 2,
  ingredient_id: 3
}];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('client_restriction').del()
    .then(function() {
      // Inserts seed entries
      return knex('client_restriction').insert(data);
    })
    .then(function() {
      return knex.raw("SELECT setval('client_restriction_id_seq', (SELECT MAX(id) from client_restriction));");
    });
};
