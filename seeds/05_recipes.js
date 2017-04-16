const data = [{
  id: 1,
  name: "cauliflower buffalo bites",
  // instructions: "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
}, {
  id: 2,
  name: "simple oatmeal",
  // instructions: "1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil."
}, {
  id: 3,
  name: "cheese omelette",
  description: "Great when making breakfast for the family!  Can be eaten cold too!"
  // instructions: "1.Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.2.Place a small non-stick frying pan on a low heat to warm up."
}, {
  id: 4,
  name: "Recipe #4",
  // instructions: "This is how we do it."
}, {
  id: 5,
  name: "Recipe #5",
  // instructions: "It's Friday night."
}, {
  id: 6,
  name: "Recipe #6",
  // instructions: "And I'm feelin' right."
}, {
  id: 7,
  name: "Recipe #7",
  // instructions: "The party's over on the west side."
}, {
  id: 8,
  name: "Recipe #8",
  // instructions: "So I creep..."
}];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("recipes").del()
    .then(function () {
      // Inserts seed entries
      return knex("recipes").insert(data);
    })
    .then(function() {
      return knex.raw("SELECT setval('recipes_id_seq', (SELECT MAX(id) from recipes));");
    });
};
