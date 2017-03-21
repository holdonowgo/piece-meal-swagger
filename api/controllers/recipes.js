'use strict';
const knex = require('../../knex');

module.exports = {
  getRecipesList: getRecipesList
};

function getRecipesList(req, res) {
  return knex("recipes").then((rows) => {
    let result = { ingredients: rows };
    return res.json(result);
  });
}
