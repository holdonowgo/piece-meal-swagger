'use strict';
const knex = require('../../knex');
const bookshelf = require('../../bookshelf');
// const Client = require('../models/client.js').Client;

module.exports = {
    getClient: getClient,
    getClients: getClients,
    addClient: addClient
};

function addClient(req, res) {
  res.set('Content-Type', 'application/json');
  res.json({});
}

function getClient(req, res) {
  res.set('Content-Type', 'application/json');
  res.json({});
}

function getClients(req, res) {
    // To list clients

    let promises = [];
    // promises.push(knex("clients").select("id"));
    promises.push(knex("clients").select("id", "first_name", "last_name", "email"));
    // promises.push(knex("ingredient_tags").select("ingredient_id", "tag_text"));
    Promise.all(promises)
        .then((results) => {
            let clients = results[0];
            // let tags = results[1];

            // for (let ingredient of ingredients) {
            //     let t = tags.filter((tag) => {
            //         return tag.ingredient_id === ingredient.id;
            //     }).map((tag) => {
            //         return tag.tag_text;
            //     }).sort();
            //
            //     ingredient.tags = t;
            // };

            let payload = {
                clients: clients
            };

            console.log({clients: clients});

            return res.json({clients: clients});
        });
}
