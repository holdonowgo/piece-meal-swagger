const data = [{
  id:1,
  name: 'bacon'
}, {
  id:2,
  name: 'egg'
}, {
  id: 3,
  name: 'milk'
}, {
  id: 4,
  name: 'avocado'
}];

exports.seed = function(knex, Promise) {
  //delete all existing rolls if any -- maybe you run the seed file too many times
  return knex('ingredients').del()
    .then(function() {
      //then insert the data
      return knex('ingredients').insert(data);
    })
    .then(function() {
      //update id to the maximum id using raw SQL
      return knex.raw("SELECT setval('ingredients_id_seq', (SELECT MAX(id) from ingredients));");
    });
};
