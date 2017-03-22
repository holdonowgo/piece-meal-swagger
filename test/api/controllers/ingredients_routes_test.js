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

console.log(suite);

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
            .get('/ingredients')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                "ingredients": [{
                        "id": 1,
                        "name": "bacon",
                        "tags": ['meat', 'pork'],
                        "active": true
                    },
                    {
                        "id": 2,
                        "name": "egg",
                        "tags": ['vegetarian'],
                        "active": true
                    },
                    {
                        "id": 3,
                        "name": "milk",
                        "tags": ['dairy', 'vegetarian'],
                        "active": true
                    },
                    {
                        "id": 4,
                        "name": "avocado",
                        "tags": ['vegan', 'vegetarian'],
                        "active": true
                    }
                ]
            }, done);
    });

    test('GET /ingredients/:id', (done) => {
        /* eslint-disable max-len */
        request(server)
            .get('/ingredients/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                "id": 1,
                "name": "bacon",
                "tags": ['meat', 'pork'],
                "alternatives": [],
                "active": true
            }, done);

        /* eslint-enable max-len */
    });

    test('POST /ingredients', (done) => {
        /* eslint-disable max-len */
        request(server)
            .post('/ingredients')
            .set('Accept', 'application/json')
            .send({
                name: 'salmon',
                tags: ['seafood', 'fish'],
                active: true
            })
            .expect('Content-Type', /json/)
            .expect((res) => {
                delete res.body.createdAt;
                delete res.body.updatedAt;
            })
            .expect(200, {
                id: 5,
                name: 'salmon',
                tags: ['seafood', 'fish'],
                active: true
            }, done);

        /* eslint-enable max-len */
    });

    // test('PATCH /ingredients/:id', (done) => {
    //     /* eslint-disable max-len */
    //     request(server)
    //         .patch('/ingredients/1')
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
    //
    test('DELETE /ingredients/:id', (done) => {
        /* eslint-disable max-len */
        request(server)
            .del('/ingredients/1')
            .set('Accept', 'application/json')
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

    // test('GET /ingredients/9000', (done) => {
    //     request(server)
    //         .get('/ingredients/9000')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('GET /ingredients/-1', (done) => {
    //     request(server)
    //         .get('/ingredients/-1')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('GET /ingredients/one', (done) => {
    //     request(server)
    //         .get('/ingredients/one')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('POST /ingredients without name', (done) => {
    //     /* eslint-disable max-len */
    //     request(server)
    //         .post('/ingredients')
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
    //         .patch('/ingredients/9000')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('PATCH /ingredients/-1', (done) => {
    //     request(server)
    //         .patch('/ingredients/-1')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('PATCH /ingredients/one', (done) => {
    //     request(server)
    //         .patch('/ingredients/one')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('DELETE /ingredients/9000', (done) => {
    //     request(server)
    //         .del('/books/9000')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('DELETE /ingredients/-1', (done) => {
    //     request(server)
    //         .del('/books/-1')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
    //
    // test('DELETE /ingredients/one', (done) => {
    //     request(server)
    //         .del('/books/one')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /plain/)
    //         .expect(404, 'Not Found', done);
    // });
});
