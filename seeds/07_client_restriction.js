const data = [{
  id: 1,
  client_id: 2,
  ingredient_id: 1
}, {
  id: 2,
  client_id: 2,
  ingredient_id: 3
}, {
  id: 3,
  client_id: 2,
  ingredient_id: 2
}, {
  id: 4,
  client_id: 3,
  ingredient_id: 3
}, {
  id: 5,
  client_id: 3,
  ingredient_id: 4
}, {
  id: 6,
  client_id: 4,
  ingredient_id: 2
}, {
  id: 7,
  client_id: 4,
  ingredient_id: 20
}, {
  id: 8,
  client_id: 4,
  ingredient_id: 17
}
, {
  id: 9,
  client_id: 4,
  ingredient_id: 25
}
, {
  id: 10,
  client_id: 4,
  ingredient_id: 26
}
, {
  id: 11,
  client_id: 4,
  ingredient_id: 24
}
, {
  id: 12,
  client_id: 4,
  ingredient_id: 22
}
];

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
