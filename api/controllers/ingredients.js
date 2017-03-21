'use strict';
const knex = require('../../knex');

module.exports = {
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
            };

            let payload = {
                ingredients: ingredients
            };

            return res.json(payload);
        })
}
