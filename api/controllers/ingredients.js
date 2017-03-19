'use strict';
const knex = require('../../knex');

module.exports = {
  getIngredientsList: getIngredientsList
};

function getIngredientsList(req, res) {
  // To list ingredients
  return knex("ingredients").then((rows) => {
    var result = {ingredients: rows};
    return res.json(result);
  });
}
