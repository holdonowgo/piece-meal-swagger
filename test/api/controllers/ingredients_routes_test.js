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
                        "description": "",
                        "active": true,
                        "tags": ['meat', 'pork'],
                        "description": "Mmmmmmmmm...Bacon!"
                    },
                    {
                        "id": 2,
                        "name": "egg",
                        "description": "",
                        "active": true,
                        "tags": ['vegetarian']
                    },
                    {
                        "id": 3,
                        "name": "milk",
                        "description": "",
                        "active": true,
                        "tags": ['dairy', 'vegetarian']
                    },
                    {
                        "id": 4,
                        "name": "avocado",
                        "description": "",
                        "active": true,
                        "tags": ['vegan', 'vegetarian']
                    },
                    {
                        "id": 5,
                        "name": "almond milk",
                        "description": "",
                        "active": true,
                        "tags": []
                    },
                    {
                        "id": 6,
                        "name": "coconut milk",
                        "description": "",
                        "active": true,
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 7,
                        "name": "brown sugar",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 8,
                        "name": "spinach",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 9,
                        "name": "kale",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 10,
                        "name": "tomato",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 11,
                        "name": "banana",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 12,
                        "name": "grapes",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 13,
                        "name": "chicken breast (bone-in)",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 14,
                        "name": "chicken thigh (skin-on)",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 15,
                        "name": "russet potato",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 16,
                        "name": "lime juice (fresh)",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 17,
                        "name": "lemon juice (fresh)",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 18,
                        "name": "salt",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 19,
                        "name": "black pepper",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 20,
                        "name": "grains of paradise",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 21,
                        "name": "garlic",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 22,
                        "name": "onion",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 23,
                        "name": "asafoetida (powder)",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 24,
                        "name": "white flour",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 25,
                        "name": "carrot",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 26,
                        "name": "celery",
                        "description": "",
                        "tags": []
                    },
                    {
                        "active": true,
                        "id": 27,
                        "name": "kombu",
                        "description": "",
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
                "description": "Mmmmmmmmm...Bacon!",
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
                    name: 'garlic',
                    description: ""
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
                description: 'Mmmmmmmmm...Bacon!',
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
