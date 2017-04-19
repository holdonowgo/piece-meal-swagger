const data = [{
  id:1,
  name: 'bacon',
  description: 'Mmmmmmmmm...Bacon!'
}, {
  id:2,
  name: 'egg'
}, {
  id: 3,
  name: 'milk'
}, {
  id: 4,
  name: 'avocado'
}, {
  id: 5,
  name: 'almond milk'
}, {
  id: 6,
  name: 'coconut milk'
}, {
  id: 7,
  name: 'brown sugar'
}, {
  id: 8,
  name: 'spinach'
}, {
  id: 9,
  name: 'kale'
}, {
  id: 10,
  name: 'tomato'
}, {
  id: 11,
  name: 'banana'
}, {
  id: 12,
  name: 'grapes'
}, {
  id: 13,
  name: 'chicken breast (bone-in)'
}, {
  id: 14,
  name: 'chicken thigh (skin-on)'
}, {
  id: 15,
  name: 'russet potato'
}, {
  id: 16,
  name: 'lime juice (fresh)'
}, {
  id: 17,
  name: 'lemon juice (fresh)'
}, {
  id: 18,
  name: 'salt'
}, {
  id: 19,
  name: 'black pepper'
}, {
  id: 20,
  name: 'grains of paradise'
}, {
  id: 21,
  name: 'garlic'
}, {
  id: 22,
  name: 'onion'
}, {
  id: 23,
  name: 'asafoetida (powder)'
}, {
  id: 24,
  name: 'white flour'
}, {
  id: 25,
  name: 'carrot'
}, {
  id: 26,
  name: 'celery'
}, {
  id: 27,
  name: 'kombu'
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
