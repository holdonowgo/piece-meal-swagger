const data = [{
  id: 1,
  name: 'cauliflower buffalo bites',
  instruction: '1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk.'
}, {
  id: 2,
  name: 'simple oatmeal',
  instruction: '1.Place 3/4 cup of the rolled oats into a blender and process until a flour.\
              \n2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil.'
}, {
  id: 3,
  name: 'cheese omelette',
  instruction: '1.Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.\
              \n2.Place a small non-stick frying pan on a low heat to warm up.'
}];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('recipes').del()
    .then(function () {
      // Inserts seed entries
      return knex('recipes').insert(data);
    })
    .then(function() {
      return knex.raw("SELECT setval('ingredients_id_seq', (SELECT MAX(id) from ingredients));");
    });
};
