'use strict';

module.exports = {
  getIngredientsList: getIngredientsList
};

function getIngredientsList(req, res) {
  // fill in the knex stuff to list ingredients
  // knex("ingredients").then((rows) => {
  //   res.json({ingredients: [rows]});
  // })
  res.json({ingredients:[]});
}
