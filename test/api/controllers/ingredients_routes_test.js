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
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ5MTE4NTkzMCwiZXhwIjoxNDkxNzkwNzMwfQ.s4Z3TmJt8DbHkdg2mG5uYK9ey8HPaVoD7mg6_MkGhys";

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

    test('GET /ingredients', (done) => {
        /* eslint-disable max-len */
        request(server)
            .get('/api/v1/ingredients')
            .set('Accept', 'application/json')
            .set('Token', authToken)
            .expect('Content-Type', /json/)
            .expect(200, {
                "ingredients": [{
                        "id": 1,
                        "name": "bacon",
                        "active": true,
                        "tags": ['meat', 'pork']
                    },
                    {
                        "id": 2,
                        "name": "egg",
                        "active": true,
                        "tags": ['vegetarian']
                    },
                    {
                        "id": 3,
                        "name": "milk",
                        "active": true,
                        "tags": ['dairy', 'vegetarian']
                    },
                    {
                        "id": 4,
                        "name": "avocado",
                        "active": true,
                        "tags": ['vegan', 'vegetarian']
                    },
                    {
                        "id": 5,
                        "name": "almond milk",
                        "active": true,
                        "tags": []
                    },
                    {
                        "id": 6,
                        "name": "coconut milk",
                        "active": true,
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 7,
                        "name": "brown sugar",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 8,
                        "name": "spinach",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 9,
                        "name": "kale",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 10,
                        "name": "tomato",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 11,
                        "name": "banana",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 12,
                        "name": "grapes",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 13,
                        "name": "chicken breast (bone-in)",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 14,
                        "name": "chicken thigh (skin-on)",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 15,
                        "name": "russet potato",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 16,
                        "name": "lime juice (fresh)",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 17,
                        "name": "lemon juice (fresh)",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 18,
                        "name": "salt",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 19,
                        "name": "black pepper",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 20,
                        "name": "grains of paradise",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 21,
                        "name": "garlic",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 22,
                        "name": "onion",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 23,
                        "name": "asafoetida (powder)",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 24,
                        "name": "white flour",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 25,
                        "name": "carrot",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 26,
                        "name": "celery",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 27,
                        "name": "kombu",
                        "tags": []
                    }
                ]
            }, done);
    });

    test('GET /ingredients/:id', (done) => {
        /* eslint-disable max-len */
        request(server)
            .get('/api/v1/ingredients/1')
            .set('Accept', 'application/json')
            .set('Token', authToken)
            .expect('Content-Type', /json/)
            .expect(200, {
                "id": 1,
                "name": "bacon",
                "active": true,
                "tags": ['meat', 'pork'],
                "alternatives": [{
                    id: 2,
                    name: 'egg'
                }, {
                    id: 3,
                    name: 'milk'
                }],
                "calories": 120
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
                tags: ['seafood', 'fish'],
                active: true
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                delete res.body.createdAt;
                delete res.body.updatedAt;
            })
            .expect(200, {
                id: 28,
                name: 'tuna',
                tags: ['seafood', 'fish'],
                active: true
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
                    name: 'garlic'
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
                calories: 299
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

    // test('PATCH /ingredients/:id', (done) => {
    //     /* eslint-disable max-len */
    //     request(server)
    //         .patch('/api/v1/ingredients/1')
    //         .set('Accept', 'application/json')
    //         .send({
    //             name: 'BACON',
    //             tags: ['pork', 'meat'],
    //             active: true
    //         })
    //         .expect('Content-Type', /json/)
    //         .expect((res) => {
    //             delete res.body.createdAt;
    //             delete res.body.updatedAt;
    //         })
    //         .expect(200, {
    //             id: 1,
    //             name: 'BACON',
    //             tags: ['pork', 'meat'],
    //             active: true
    //         }, done);
    //
    //     /* eslint-enable max-len */
    // });

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
                // tags: ['meat', 'pork'],
                // alternatives: [],
                active: false
            }, done);

        /* eslint-enable max-len */
    });

    test('GET /search/ingredients/?text=mi', (done) => {
        request(server)
            .get('/api/v1/search/ingredients?text=mi')
            .set('Accept', 'application/json')
            .set('Token', authToken)
            .expect('Content-Type', /json/)
            .expect(200, {
                "ingredients": [{
                        "id": 3,
                        "name": "milk",
                        "tags": ['dairy', 'vegetarian'],
                        "active": true
                    },
                    {
                        "id": 5,
                        "name": "almond milk",
                        "tags": [],
                        "active": true
                    },
                    {
                        "id": 6,
                        "name": "coconut milk",
                        "tags": [],
                        "active": true
                    }
                ]
            }, done);
    });

    // test('GET /ingredients/9000', (done) => {
    //     request(server)
    //         .get('/api/v1/ingredients/9000')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('GET /ingredients/-1', (done) => {
    //     request(server)
    //         .get('/api/v1/ingredients/-1')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('GET /ingredients/one', (done) => {
    //     request(server)
    //         .get('/api/v1/ingredients/one')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
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
    //
    // test('PATCH /ingredients/9000', (done) => {
    //     request(server)
    //         .patch('/api/v1/ingredients/9000')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('PATCH /ingredients/-1', (done) => {
    //     request(server)
    //         .patch('/api/v1/ingredients/-1')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('PATCH /ingredients/one', (done) => {
    //     request(server)
    //         .patch('/api/v1/ingredients/one')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('DELETE /ingredients/9000', (done) => {
    //     request(server)
    //         .del('/api/v1/books/9000')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('DELETE /ingredients/-1', (done) => {
    //     request(server)
    //         .del('/api/v1/books/-1')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('DELETE /ingredients/one', (done) => {
    //     request(server)
    //         .del('/api/v1/books/one')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
});
