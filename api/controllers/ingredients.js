'use strict';
const knex = require('../../knex');

module.exports = {
    getIngredient: getIngredient,
    addIngredient: addIngredient,
    getIngredientsList: getIngredientsList
};

// function getIngredientsList(req, res) {
//     // To list ingredients
//     return knex("ingredients").select("id", "name").then((rows) => {
//         let result = {
//             ingredients: rows
//         };
//         console.log('RESULT', result);
//         delete result.created_at;
//         delete result.created_at;
//         return res.json(result);
//     });
// }

// function getIngredientsList(req, res) {
//     // To list ingredients
//     return knex("ingredients")
//         .join('ingredient_tags', 'ingredients.id', 'ingredient_tags.ingredient_id')
//         .select('*')
//         .then((rows) => {
//             let result = {
//                 ingredients: rows
//             };
//             console.log('RESULT', result);
//             delete result.created_at;
//             delete result.created_at;
//             return res.json(result);
//         });
// }

function getIngredientsList(req, res) {

    // To list ingredients

    let promises = [];
    promises.push(knex("ingredients").select("id", "name"));
    promises.push(knex("ingredient_tags").select("ingredient_id", "tag_text"));
    Promise.all(promises)
        .then((results) => {
            let ingredients = results[0];
            let tags = results[1];

            for (let ingredient of ingredients) {
                let t = tags.filter((tag) => {
                    return tag.ingredient_id === ingredient.id;
                }).map((tag) => {
                    return tag.tag_text;
                }).sort();

                ingredient.tags = t;

                console.log(ingredient);
            };

            let payload = {
                ingredients: ingredients
            };

            return res.json(payload);
        });
}

function getIngredient(req, res) {
    let promises = [];
    promises.push(
        knex("ingredients").select("id", "name")
        .first().where("id", req.swagger.params.id.value)
    );
    promises.push(
        knex("ingredient_tags").select("ingredient_id", "tag_text")
        .where("ingredient_id", req.swagger.params.id.value)
    );
    Promise.all(promises)
        .then((results) => {
            let ingredient = results[0];
            let tags = results[1];

            let t = tags.map((tag) => {
                return tag.tag_text;
            }).sort();

            ingredient.tags = t;
            ingredient.alternatives = [];

            delete ingredient.created_at;

            return res.json(ingredient);
        })
}

function addIngredient(req, res) {
    return res.json({});
}
