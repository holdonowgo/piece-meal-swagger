/*jshint esversion: 6 */
'use strict';

process.env.NODE_ENV = 'test';

const {suite, test} = require('mocha');
const request = require('supertest');
const bcrypt = require('bcrypt');
const knex = require('../../../knex');
const server = require('../../../app');
const should = require('should');
const authToken = process.env.AUTH_TOKEN;
const description = `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`;

const deleteIngredientTimestamps = function(res) {
  delete res.body.created_at;
  delete res.body.updated_at;
};

const deleteIngredientsTimestamps = function(res) {
    for (let ingredient of res.body.ingredients) {
      delete ingredient.created_at;
      delete ingredient.updated_at;
    }
};

suite('ingredients test', () => {
  before((done) => {
    knex.migrate.latest().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

  beforeEach((done) => {
    knex.seed.run().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

  test('GET /ingredients', (done) => {
    /* eslint-disable max-len */
    request(server).get('/api/v1/ingredients').set('Accept', 'application/json')
    // .set('Token', authToken)
      .expect('Content-Type', /json/)
      .expect((res) => deleteIngredientsTimestamps(res))
      .expect(200, {
      "ingredients": [
        {
          "id": 5,
          "name": "almond milk",
          "description": description,
          "active": true,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 23,
          "name": "asafoetida (powder)",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "id": 4,
          "name": "avocado",
          "description": description,
          "active": true,
          "tags": [
            'vegan', 'vegetarian'
          ],
          "image_url": ""
        }, {
          "id": 1,
          "name": "bacon",
          "description": description,
          "active": true,
          "tags": [
            'meat', 'pork'
          ],
          "description": "Mmmmmmmmm...Bacon!",
          "image_url": ""
        }, {
          "active": true,
          "id": 11,
          "name": "banana",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 19,
          "name": "black pepper",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 7,
          "name": "brown sugar",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 25,
          "name": "carrot",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 26,
          "name": "celery",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 13,
          "name": "chicken breast (bone-in)",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 14,
          "name": "chicken thigh (skin-on)",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "id": 6,
          "name": "coconut milk",
          "description": description,
          "active": true,
          "tags": [],
          "image_url": ""
        }, {
          "id": 2,
          "name": "egg",
          "description": description,
          "active": true,
          "tags": ['vegetarian'],
          "image_url": ""
        }, {
          "active": true,
          "id": 21,
          "name": "garlic",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 20,
          "name": "grains of paradise",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 12,
          "name": "grapes",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 9,
          "name": "kale",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 27,
          "name": "kombu",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 17,
          "name": "lemon juice (fresh)",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 16,
          "name": "lime juice (fresh)",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "id": 3,
          "name": "milk",
          "description": description,
          "active": true,
          "tags": [
            'dairy', 'vegetarian'
          ],
          "image_url": ""
        }, {
          "active": true,
          "id": 22,
          "name": "onion",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 15,
          "name": "russet potato",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 18,
          "name": "salt",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 8,
          "name": "spinach",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 10,
          "name": "tomato",
          "description": description,
          "tags": [],
          "image_url": ""
        }, {
          "active": true,
          "id": 24,
          "name": "white flour",
          "description": description,
          "tags": [],
          "image_url": ""
        }
      ]
    }, done);
  });

  test('GET /ingredients/:id', (done) => {
    /* eslint-disable max-len */
    request(server).get('/api/v1/ingredients/1').set('Accept', 'application/json')
    // .set('Token', authToken)
      .expect('Content-Type', /json/)
      .expect((res) => {
          deleteIngredientTimestamps(res);
      })
      .expect(200, {
      "id": 1,
      "name": "bacon",
      "active": true,
      "tags": [
        'meat', 'pork'
      ],
      "description": "Mmmmmmmmm...Bacon!",
      "alternatives": [
        {
          "active": true,
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 2,
          "image_url": "",
          "name": "egg"
        }, {
          "active": true,
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 3,
          "image_url": "",
          "name": "milk"
        }
      ],
      // "calories": 120,
      "image_url": ""
    }, done);

    /* eslint-enable max-len */
  });

  test('POST /ingredients', (done) => {
    /* eslint-disable max-len */
    request(server).post('/api/v1/ingredients').set('Accept', 'application/json').set('Token', authToken).send({
      name: 'tuna',
      description: description,
      tags: [
        'fish', 'seafood'
      ],
      alternatives: [
        {
          'alt_ingredient_id': 1,
          'ratio': '1:2'
        }
      ],
      image_url: ''
    }).expect('Content-Type', /json/).expect((res) => {
      deleteIngredientTimestamps(res);
    }).expect(200, {
      id: 28,
      name: 'tuna',
      // calories: 185,
      description: description,
      tags: [
        'fish', 'seafood'
      ],
      alternatives: [
        {
          active: true,
          id: 1,
          image_url: '',
          name: 'bacon',
          description: "Mmmmmmmmm...Bacon!"
        }
      ],
      active: true,
      image_url: ''
    }, done);

    /* eslint-enable max-len */
  });

  test('POST /ingredients only name and response', (done) => {
    /* eslint-disable max-len */
    request(server).post('/api/v1/ingredients').set('Accept', 'application/json')
    .set('Token', authToken)
    .send(
        {
            "name": "tuna",
            "description": "",
            tags: [],
            alternatives: []
        })
    .expect('Content-Type', /json/)
    .expect((res) => {
      deleteIngredientTimestamps(res);
    }).expect(200, {
      id: 28,
      name: 'tuna',
      // calories: 185,
      description: "",
      tags: [],
      alternatives: [],
      active: true,
      image_url: ''
    }, done);

    /* eslint-enable max-len */
  });

  test('POST /ingredients using duplicate name', (done) => {
    /* eslint-disable max-len */
    request(server).post('/api/v1/ingredients')
    .set('Accept', 'application/json')
    .set('Token', authToken)
    .send(
      {
        name: 'garlic',
        tags: [],
        alternatives: [],
        active: true
      })
    .expect('Content-Type', /json/)
    .expect(400, {
      message: 'Ingredient already exists!',
      ingredient: {
        active: true,
        id: 21,
        name: 'garlic',
        description: description,
        "image_url": ""
      }
    }, done);

    /* eslint-enable max-len */
  });

  test('POST /ingredients/:id/alternatives', (done) => {
    /* eslint-disable max-len */
    request(server).post('/api/v1/ingredients/13/alternatives')
    .set('Accept', 'application/json')
    .set('Token', authToken).send({
          ingredients: [7, 10, 12]
      }).expect((res) => {
          deleteIngredientTimestamps(res);
      }).expect('Content-Type', /json/).expect(200, {
      "id": 13,
      "name": "chicken breast (bone-in)",
      // "calories": 185,
      "description": description,
      "active": true,
      "alternatives": [],
      "tags": [],
      "alternatives": [
        {
          "active": true,
          "description": description,
          "id": 7,
          "image_url": "",
          "name": "brown sugar"
        }, {
          "active": true,
          "description": description,
          "id": 10,
          "image_url": "",
          "name": "tomato"
        }, {
          "active": true,
          "description": description,
          "id": 12,
          "image_url": "",
          "name": "grapes"
        }
      ],
      // calories: 299,
      "image_url": ""
    }, done);
    // .end(function(err, res) {
    //     let compare = {
    //         "id": 9,
    //         "name": "kale",
    //         "active": true,
    //         "tags": [],
    //         "alternatives": [{
    //             id: 7,
    //             name: 'brown sugar'
    //         }, {
    //             id: 10,
    //             name: 'tomato'
    //         }, {
    //             id: 12,
    //             name: 'grapes'
    //         }]
    //     };
    //     // HTTP status should be 200
    //     res.status.should.equal(200);
    //     // Error key should be false.
    //     res.body.should.equal(compare);
    //     done();
    // });

    /* eslint-enable max-len */
  });

  test('PUT /ingredients/:id', (done) => {
    /* eslint-disable max-len */
    request(server).put('/api/v1/ingredients/1').set('Accept', 'application/json').set('Token', authToken).send({
      name: 'Bacon Strips',
      description: "It's bacon...need we say more?",
      tags: [
        'pork', 'meat'
      ],
      "image_url": "",
      active: true
    }).expect('Content-Type', /json/).expect((res) => {
        deleteIngredientTimestamps(res);
    }).expect(200, {
      id: 1,
      name: 'Bacon Strips',
      description: "It's bacon...need we say more?",
      "alternatives": [
        {
          "active": true,
          "description": description,
          "id": 2,
          "image_url": "",
          "name": "egg"
        }, {
          "active": true,
          "description": description,
          "id": 3,
          "image_url": "",
          "name": "milk"
        }
      ],
      // "calories": 120,
      tags: [
        'meat', 'pork'
      ],
      active: true,
      "image_url": ""
    }, done);

    /* eslint-enable max-len */
  });

  test('DELETE /ingredients/:id', (done) => {
      /* eslint-disable max-len */
      request(server)
          .del('/api/v1/ingredients/1')
          .set('Accept', 'application/json')
          .set('token', authToken)
          // .expect('Content-Type', /json/)
          .expect((res) => {
              delete res.body.createdAt;
              delete res.body.updatedAt;
          })
          .expect(204, done);

      /* eslint-enable max-len */
  });

  test('GET /search/ingredients/?text=mi', (done) => {
      request(server)
          .get('/api/v1/search/ingredients?text=mi')
          .set('Accept', 'application/json')
          // .set('Token', authToken)
          .expect('Content-Type', /json/)
          .expect(200, {
              "ingredients": [
                  {
                      "id": 5,
                      "name": "almond milk",
                      "tags": [],
                      "image_url": "",
                      "active": true
                  },
                  {
                      "id": 6,
                      "name": "coconut milk",
                      "tags": [],
                      "image_url": "",
                      "active": true
                  },
                  {
                      "id": 3,
                      "name": "milk",
                      "tags": ['dairy', 'vegetarian'],
                      "image_url": "",
                      "active": true
                  }
              ]
          }, done);
  });

  test('GET /ingredients/9000', (done) => {
      request(server)
          .get('/api/v1/ingredients/9000')
          .set('Accept', 'application/json')
          // .set('Token', authToken)
          .expect(404, JSON.stringify('Not Found'), done);
  });

  test('GET /ingredients/-1', (done) => {
      request(server)
          .get('/api/v1/ingredients/-1')
          .set('Accept', 'application/json')
          // .set('Token', authToken)
          .expect(404, JSON.stringify('Not Found'), done);
  });

  test('GET /ingredients/one', (done) => {
      request(server)
          .get('/api/v1/ingredients/one')
          .set('Accept', 'application/json')
          // .set('Token', authToken)
          .expect(400, JSON.stringify(
            {
              "message":"Request validation failed: Parameter (id) is not a valid integer: one",
              "code":"INVALID_TYPE",
              "failedValidation":true,
              "path":["paths",
              "/ingredients/{id}",
              "get","parameters","0"],
              "paramName":"id"
            }), done);
  });

  test('POST /ingredients without name', (done) => {
      /* eslint-disable max-len */
      request(server)
          .post('/api/v1/ingredients')
          .set('Accept', 'application/json')
          .set('Token', authToken)
          .send({
              tags: ['citrus']
          })
          .expect('Content-Type', /json/)
          .expect(400, done);

      /* eslint-enable max-len */
  });

  test('PUT /ingredients/9000', (done) => {
      request(server)
          .put('/api/v1/ingredients/9000')
          .set('Accept', 'application/json')
          .set('Token', authToken)
          .expect(400, done);
  });

  test('PUT /ingredients/-1', (done) => {
      request(server)
          .put('/api/v1/ingredients/-1')
          .set('Accept', 'application/json')
          .set('Token', authToken)
          .send({
              name: 'Bacon Strips',
              description: "It's bacon...need we say more?",
              tags: [
                'pork', 'meat'
              ],
              "image_url": "",
              active: true
          })
          .expect(404, JSON.stringify('Not Found'), done);
  });

  test('PUT /ingredients/one', (done) => {
      request(server)
          .put('/api/v1/ingredients/one')
          .set('Accept', 'application/json')
          .set('Token', authToken)
          .expect(400, done);
  });

  test('DELETE /ingredients/9000', (done) => {
      request(server)
          .del('/api/v1/books/9000')
          .set('Accept', 'application/json')
          .set('Token', authToken)
          .expect(404, done);
  });

  test('DELETE /ingredients/-1', (done) => {
      request(server)
          .del('/api/v1/books/-1')
          .set('Accept', 'application/json')
          .set('Token', authToken)
          .expect(404, done);
  });

  test('DELETE /ingredients/one', (done) => {
      request(server)
          .del('/api/v1/books/one')
          .set('Accept', 'application/json')
          .set('Token', authToken)
          .expect(404, done);
  });
});
