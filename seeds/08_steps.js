
const data = [{
  id: 1,
  recipe_id: 1,
  step_number: 1,
  instructions: 'do step one'
},{
  id: 2,
  recipe_id: 1,
  step_number: 2,
  instructions: 'do step two'
},{
  id: 3,
  recipe_id: 1,
  step_number: 3,
  instructions: 'do step three'
},{
  id: 4,
  recipe_id: 1,
  step_number: 4,
  instructions: 'do step four'
},{
  id: 5,
  recipe_id: 1,
  step_number: 5,
  instructions: 'do step five'
},{
  id: 6,
  recipe_id: 3,
  step_number: 1,
  instructions: 'Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.'
},{
  id: 7,
  recipe_id: 3,
  step_number: 2,
  instructions: 'Place a small non-stick frying pan on a low heat to warm up.'
},{
  id: 8,
  recipe_id: 9,
  step_number: 1,
  instructions: "Cut pineapple flesh into small dice, we'll use about 1 cup"
},{
  id: 9,
  recipe_id: 9,
  step_number: 2,
  instructions: "In a small bowl, season the chicken salt and pepper and a few drops of sesame oil. In a separate small bowl, do the same for the shrimp"
},{
  id: 10,
  recipe_id: 9,
  step_number: 3,
  instructions: "Heat a wok or large saute pan over medium-high heat.When hot, swirl in 1 tablespoon of cooking oil. Add in the eggs, and scramble until just set. "
},{
  id: 11,
  recipe_id: 9,
  step_number: 4,
  instructions: "Add the chicken pieces and stir fry until just browned. Add in the shrimp to the wok and stir fry the chicken and shrimp together, until the shrimp is pink and the chicken is cooked through"
},{
  id: 12,
  recipe_id: 9,
  step_number: 5,
  instructions: "Add in the soy sauce and sesame oil, give it a good toss. Add in the reserved egg/chicken/shrimp mixture, the pineapple cubes, the peas and toss well. Cook for an 2 minutes, until all ingredients are heated through. Taste, and season with additional soy sauce and black pepper, if desired"
}

];

exports.seed = function(knex, Promise) {
  //delete all existing rolls if any -- maybe you run the seed file too many times
  return knex('recipe_steps').del()
    .then(function() {
      //then insert the data
      return knex('recipe_steps').insert(data);
    })
    .then(function() {
      //update id to the maximum id using raw SQL
      return knex.raw("SELECT setval('recipe_steps_id_seq', (SELECT MAX(id) from recipe_steps));");
    });
};
