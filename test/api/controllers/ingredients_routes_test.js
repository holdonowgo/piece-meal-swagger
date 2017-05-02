/*jshint esversion: 6 */
'use strict';

process.env.NODE_ENV = 'test';

// const should = require('should');
// const request = require('supertest');
// const server = require('../../../app');
// const knex = require('../../../knex');
// const {
//     suite,
//     test
// } = require('mocha');

const {
    suite,
    test
} = require('mocha');
const request = require('supertest');
const bcrypt = require('bcrypt');
const knex = require('../../../knex');
const server = require('../../../app');
const should = require('should');
const authToken = process.env.AUTH_TOKEN;

suite('ingredients test', () => {
    before((done) => {
        knex.migrate.latest()
            .then(() => {
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    beforeEach((done) => {
        knex.seed.run()
            .then(() => {
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    // test('GET /ingredients', (done) => {
    //     /* eslint-disable max-len */
    //     request(server)
    //         .get('/api/v1/ingredients')
    //         .set('Accept', 'application/json')
    //         // .set('Token', authToken)
    //         .expect('Content-Type', /json/)
    //         .expect(200, {
    //             "ingredients": [{
    //                     "id": 1,
    //                     "name": "bacon",
    //                     "description": "",
    //                     "active": true,
    //                     "tags": ['meat', 'pork'],
    //                     "description": "Mmmmmmmmm...Bacon!",
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "id": 2,
    //                     "name": "egg",
    //                     "description": "",
    //                     "active": true,
    //                     "tags": ['vegetarian'],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "id": 3,
    //                     "name": "milk",
    //                     "description": "",
    //                     "active": true,
    //                     "tags": ['dairy', 'vegetarian'],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "id": 4,
    //                     "name": "avocado",
    //                     "description": "",
    //                     "active": true,
    //                     "tags": ['vegan', 'vegetarian'],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "id": 5,
    //                     "name": "almond milk",
    //                     "description": "",
    //                     "active": true,
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "id": 6,
    //                     "name": "coconut milk",
    //                     "description": "",
    //                     "active": true,
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 7,
    //                     "name": "brown sugar",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 8,
    //                     "name": "spinach",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 9,
    //                     "name": "kale",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 10,
    //                     "name": "tomato",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 11,
    //                     "name": "banana",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 12,
    //                     "name": "grapes",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 13,
    //                     "name": "chicken breast (bone-in)",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 14,
    //                     "name": "chicken thigh (skin-on)",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 15,
    //                     "name": "russet potato",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 16,
    //                     "name": "lime juice (fresh)",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 17,
    //                     "name": "lemon juice (fresh)",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 18,
    //                     "name": "salt",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 19,
    //                     "name": "black pepper",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 20,
    //                     "name": "grains of paradise",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 21,
    //                     "name": "garlic",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 22,
    //                     "name": "onion",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 23,
    //                     "name": "asafoetida (powder)",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 24,
    //                     "name": "white flour",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 25,
    //                     "name": "carrot",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 26,
    //                     "name": "celery",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 },
    //                 {
    //                     "active": true,
    //                     "id": 27,
    //                     "name": "kombu",
    //                     "description": "",
    //                     "tags": [],
    //                     "image_url": ""
    //                 }
    //             ]
    //         }, done);
    // });

    test('GET /ingredients/:id', (done) => {
        /* eslint-disable max-len */
        request(server)
            .get('/api/v1/ingredients/1')
            .set('Accept', 'application/json')
            // .set('Token', authToken)
            .expect('Content-Type', /json/)
            .expect(200, {
                "id": 1,
                "name": "bacon",
                "active": true,
                "tags": ['meat', 'pork'],
                "description": "Mmmmmmmmm...Bacon!",
                "alternatives": [{
                    id: 2,
                    name: 'egg'
                }, {
                    id: 3,
                    name: 'milk'
                }],
                "calories": 120,
                "image_url": ""
            }, done);

        /* eslint-enable max-len */
    });

    test('POST /ingredients', (done) => {
        /* eslint-disable max-len */
        request(server)
            .post('/api/v1/ingredients')
            .set('Accept', 'application/json')
            .set('Token', authToken)
            .send({
                name: 'tuna',
                description: '',
                tags: ['fish', 'seafood'],
                image_url: '',
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                delete res.body.createdAt;
                delete res.body.updatedAt;
            })
            .expect(200, {
                id: 28,
                name: 'tuna',
                description: '',
                tags: ['fish', 'seafood'],
                active: true,
                image_url: ''
            }, done);

        /* eslint-enable max-len */
    });

    test('POST /ingredients using duplicate name', (done) => {
        /* eslint-disable max-len */
        request(server)
            .post('/api/v1/ingredients')
            .set('Accept', 'application/json')
            .set('Token', authToken)
            .send({
                name: 'garlic',
                tags: [],
                active: true
            })
            .expect('Content-Type', /json/)
            .expect(400, {
                message: 'Ingredient already exists!',
                ingredient: {
                    active: true,
                    id: 21,
                    name: 'garlic',
                    description: "",
                    "image_url": ""
                }
            }, done);

        /* eslint-enable max-len */
    });

    test('POST /ingredients/:id/alternatives', (done) => {
        /* eslint-disable max-len */
        request(server)
            .post('/api/v1/ingredients/13/alternatives')
            .set('Accept', 'application/json')
            .set('Token', authToken)
            .send({
                ingredients: [7, 10, 12]
            })
            .expect('Content-Type', /json/)
            // .expect((res) => {
            //     delete res.body.createdAt;
            //     delete res.body.updatedAt;
            // })
            .expect(200, {
                "id": 13,
                "name": "chicken breast (bone-in)",
                "description": "",
                "active": true,
                "tags": [],
                "alternatives": [{
                    id: 7,
                    name: 'brown sugar'
                }, {
                    id: 10,
                    name: 'tomato'
                }, {
                    id: 12,
                    name: 'grapes'
                }],
                calories: 299,
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
        request(server)
            .put('/api/v1/ingredients/1')
            .set('Accept', 'application/json')
            .set('Token', authToken)
            .send({
                name: 'Bacon Strips',
                description: "It's bacon...need we say more?",
                tags: ['pork', 'meat'],
                "image_url": "",
                active: true
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                delete res.body.createdAt;
                delete res.body.updatedAt;
            })
            .expect(200, {
                id: 1,
                name: 'Bacon Strips',
                description: "It's bacon...need we say more?",
                "alternatives": [
                  {
                    "id": 2,
                    "name": "egg"
                  },
                  {
                    "id": 3,
                    "name": "milk"
                  }
                ],
                "calories": 120,
                tags: ['meat', 'pork'],
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
            .set('Token', authToken)
            .expect('Content-Type', /json/)
            .expect((res) => {
                delete res.body.createdAt;
                delete res.body.updatedAt;
            })
            .expect(200, {
                id: 1,
                name: 'bacon',
                description: 'Mmmmmmmmm...Bacon!',
                image_url: "",
                active: false
            }, done);

        /* eslint-enable max-len */
    });

    test('GET /search/ingredients/?text=mi', (done) => {
        request(server)
            .get('/api/v1/search/ingredients?text=mi')
            .set('Accept', 'application/json')
            // .set('Token', authToken)
            .expect('Content-Type', /json/)
            .expect(200, {
                "ingredients": [{
                        "id": 3,
                        "name": "milk",
                        "tags": ['dairy', 'vegetarian'],
                        "image_url": "",
                        "active": true
                    },
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

    // test('POST /ingredients without name', (done) => {
    //     /* eslint-disable max-len */
    //     request(server)
    //         .post('/api/v1/ingredients')
    //         .set('Accept', 'application/json')
    //         .send({
    //             tags: ['citrus']
    //         })
    //         .expect('Content-Type', /plain/)
    //         .expect(400, 'Name must not be blank', done);
    //
    //     /* eslint-enable max-len */
    // });

    // test('PUT /ingredients/9000', (done) => {
    //     request(server)
    //         .put('/api/v1/ingredients/9000')
    //         .set('Accept', 'application/json')
    //         .set('Token', authToken)
    //         .expect(400, JSON.stringify('Bad Request'), done);
    // });

    // test('PUT /ingredients/-1', (done) => {
    //     request(server)
    //         .put('/api/v1/ingredients/-1')
    //         .set('Accept', 'application/json')
    //         .set('Token', authToken)
    //         .expect(404, JSON.stringify('Not Found'), done);
    // });

    // test('PUT /ingredients/one', (done) => {
    //     request(server)
    //         .put('/api/v1/ingredients/one')
    //         .set('Accept', 'application/json')
    //         .set('Token', authToken)
    //         .expect(400, JSON.stringify(
    //           {
    //             "message":"Request validation failed: Parameter (id) is not a valid integer: one",
    //             "code":"INVALID_TYPE",
    //             "failedValidation":true,
    //             "path":["paths",
    //             "/ingredients/{id}",
    //             "get","parameters","1"],
    //             "paramName":"id"
    //           }), done);
    // });

    // test('DELETE /ingredients/9000', (done) => {
    //     request(server)
    //         .del('/api/v1/books/9000')
    //         .set('Accept', 'application/json')
    //         .set('Token', authToken)
    //         .expect(404, JSON.stringify('Not Found'), done);
    // });

    // test('DELETE /ingredients/-1', (done) => {
    //     request(server)
    //         .del('/api/v1/books/-1')
    //         .set('Accept', 'application/json')
    //         .set('Token', authToken)
    //         .expect(404, JSON.stringify('Not Found'), done);
    // });

    // test('DELETE /ingredients/one', (done) => {
    //     request(server)
    //         .del('/api/v1/books/one')
    //         .set('Accept', 'application/json')
    //         .set('Token', authToken)
    //         .expect(404, JSON.stringify('Not Found'), done);
    // });
});
