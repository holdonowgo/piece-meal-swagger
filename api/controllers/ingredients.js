'use strict';
const knex = require('../../knex');

module.exports = {
    getIngredient: getIngredient,
    addIngredient: addIngredient,
    getIngredientsList: getIngredientsList
};

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

            if (ingredient === undefined) {
                res.status(400).json('Ingredient not found');
            } else {
                let t = tags.map((tag) => {
                    return tag.tag_text;
                }).sort();

                ingredient.tags = t;
                ingredient.alternatives = [];

                delete ingredient.created_at;

                return res.json(ingredient);
            }
        })
}

// function queryIngredient(id) {
//     let promises = [];
//     promises.push(
//         knex("ingredients").select("id", "name")
//         .first().where("id", id)
//     );
//     promises.push(
//         knex("ingredient_tags").select("ingredient_id", "tag_text")
//         .where("ingredient_id", id)
//     );
//     Promise.all(promises)
//         .then((results) => {
//             let ingredient = results[0];
//             let tags = results[1];
//
//             if (ingredient === undefined) {
//                 throw new Error();
//             } else {
//                 let t = tags.map((tag) => {
//                     return tag.tag_text;
//                 }).sort();
//
//                 ingredient.tags = t;
//                 ingredient.alternatives = [];
//                 console.log("id", id);
//                 console.log(ingredient);
//                 return ingredient;
//             }
//         })
//         .catch((err) => {
//           throw new Error();
//         });
// };

function addIngredient(req, res) {
    let name = req.swagger.params.ingredient.value.name;
    var id;
    knex("ingredients")
        .first().where("name", name)
        .then((result) => {
            if (result) {
                res.status(400).json('Ingredient already exists!');
            } else {
                return knex("ingredients").insert({
                    "name": name
                }).returning('*');
            }
        })
        .then((ingredient) => {
            if (req.swagger.params.ingredient.value.tags) {
                let promises = [];
                for (let val of req.swagger.params.ingredient.value.tags) {
                    promises.push(
                        knex("ingredient_tags").insert({
                            "ingredient_id": ingredient[0].id,
                            "tag_test": val
                        }).returning('*')
                    );
                }
                return ingredient;
            }
        })
        .then((ingredient) => {
            // return res.json(queryIngredient(ingredient[0].id));
            let newIngredient = req.swagger.params.ingredient.value;
            newIngredient.id = ingredient[0].id;
            return res.json(newIngredient);
        });
}
