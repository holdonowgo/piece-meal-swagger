'use strict';
const knex = require('../../knex');

module.exports = {
    getIngredientsList: getIngredientsList,
    get_ingredients: get_ingredients
};

function getIngredientsList(req, res) {
    // To list ingredients
    return knex("ingredients").then((rows) => {
        var result = {
            ingredients: rows
        };
        return res.json(result);
    });
}

function get_ingredients(req, res) {
    // To list ingredients
    return knex("ingredients").then((rows) => {
        var result = {
            ingredients: rows
        };
        return res.json(result);
    });
}
