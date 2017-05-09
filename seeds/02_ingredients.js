const description = `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`;

const data = [{
  id:1,
  name: 'bacon',
  description: 'Mmmmmmmmm...Bacon!'
}, {
  id:2,
  name: 'egg',
  description: description
}, {
  id: 3,
  name: 'milk',
  description: description
}, {
  id: 4,
  name: 'avocado',
  description: description
}, {
  id: 5,
  name: 'almond milk',
  description: description
}, {
  id: 6,
  name: 'coconut milk',
  description: description
}, {
  id: 7,
  name: 'brown sugar',
  description: description
}, {
  id: 8,
  name: 'spinach',
  description: description
}, {
  id: 9,
  name: 'kale',
  description: description
}, {
  id: 10,
  name: 'tomato',
  description: description
}, {
  id: 11,
  name: 'banana',
  description: description
}, {
  id: 12,
  name: 'grapes',
  description: description
}, {
  id: 13,
  name: 'chicken breast (bone-in)',
  description: description
}, {
  id: 14,
  name: 'chicken thigh (skin-on)',
  description: description
}, {
  id: 15,
  name: 'russet potato',
  description: description
}, {
  id: 16,
  name: 'lime juice (fresh)',
  description: description
}, {
  id: 17,
  name: 'lemon juice (fresh)',
  description: description
}, {
  id: 18,
  name: 'salt',
  description: description
}, {
  id: 19,
  name: 'black pepper',
  description: description
}, {
  id: 20,
  name: 'grains of paradise',
  description: description
}, {
  id: 21,
  name: 'garlic',
  description: description
}, {
  id: 22,
  name: 'onion',
  description: description
}, {
  id: 23,
  name: 'asafoetida (powder)',
  description: description
}, {
  id: 24,
  name: 'white flour',
  description: description
}, {
  id: 25,
  name: 'carrot',
  description: description
}, {
  id: 26,
  name: 'celery',
  description: description
}, {
  id: 27,
  name: 'kombu',
  description: description
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
