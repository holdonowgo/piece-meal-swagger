
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
}];

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
