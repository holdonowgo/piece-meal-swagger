/*jshint esversion: 6 */
// 'use strict';

process.env.NODE_ENV = 'test';

// const assert = require('chai').assert;
// const should = require('should');
// const request = require('supertest');
// const bcrypt = require('bcrypt');
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

suite('clients tests', () => {
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

    test('GET /clients', (done) => {
        /* eslint-disable max-len */
        request(server)
            .get('/clients')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                "clients": [{
                        "id": 1,
                        "first_name": 'Marvin',
                        "last_name": 'Gaye',
                        "email": 'marvin.gaye@gmail.com',
                        "recipes": [{
                            id: 1,
                            name: "cauliflower buffalo bites",
                            instructions: "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
                        }, {
                            id: 2,
                            name: "simple oatmeal",
                            instructions: "1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil."
                        }, {
                            id: 3,
                            name: "cheese omelette",
                            instructions: "1.Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.2.Place a small non-stick frying pan on a low heat to warm up."
                        }]
                    },
                    {
                        "id": 2,
                        "first_name": 'Al',
                        "last_name": 'Green',
                        "email": 'al.green@gmail.com',
                        "recipes": []
                    }
                ]
            }, done);
    });

    test('GET /clients/:id', (done) => {
        /* eslint-disable max-len */
        request(server)
            .get('/clients/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                "id": 1,
                "first_name": 'Marvin',
                "last_name": 'Gaye',
                "email": 'marvin.gaye@gmail.com',
                "recipes": [{
                    id: 1,
                    name: "cauliflower buffalo bites",
                    instructions: "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
                }, {
                    id: 2,
                    name: "simple oatmeal",
                    instructions: "1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil."
                }, {
                    id: 3,
                    name: "cheese omelette",
                    instructions: "1.Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.2.Place a small non-stick frying pan on a low heat to warm up."
                }]
            }, done);

        /* eslint-enable max-len */
    });

    //
    // test('POST /clients', (done) => {
    //     const password = 'ilikebigcats';
    //
    //     request(server)
    //         .post('/clients')
    //         .set('Accept', 'application/json')
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             firstName: 'John',
    //             lastName: 'Siracusa',
    //             email: 'john.siracusa@gmail.com',
    //             password
    //         })
    //         .expect((res) => {
    //             delete res.body.createdAt;
    //             delete res.body.updatedAt;
    //         })
    //         .expect(200, {
    //             id: 3,
    //             firstName: 'John',
    //             lastName: 'Siracusa',
    //             email: 'john.siracusa@gmail.com'
    //         })
    //         .expect('Content-Type', /json/)
    //         .end((httpErr, _res) => {
    //             if (httpErr) {
    //                 return done(httpErr);
    //             }
    //
    //             knex('clients')
    //                 .where('id', 3)
    //                 .first()
    //                 .then((client) => {
    //                     const hashedPassword = client.hashed_password;
    //
    //                     delete client.hashed_password;
    //                     delete client.created_at;
    //                     delete client.updated_at;
    //
    //                     assert.deepEqual(client, {
    //                         id: 2,
    //                         firstName: 'John',
    //                         firstName: 'Siracusa',
    //                         email: 'john.siracusa@gmail.com'
    //                     });
    //
    //                     // eslint-disable-next-line no-sync
    //                     const isMatch = bcrypt.compareSync(password, hashedPassword);
    //
    //                     assert.isTrue(isMatch, "passwords don't match");
    //                     done();
    //                 })
    //                 .catch((dbErr) => {
    //                     done(dbErr);
    //                 });
    //         });
    // });

    test('GET /clients/:id/restrictions', (done) => {
      request(server)
        .get('/clients/2/restrictions')
        .set('Accept', 'application/json')
        .expect(200, {
          ingredients: [{
            id:1,
            name: 'bacon'
          }, {
            id: 3,
            name: 'milk'
          }]
        }, done);
    });

    test('POST clients/:id/restrictions', (done) => {
      request(server)
        .post('clients/2/restrictions')
        .set('Accept', 'application/json')
        .send({
          name: 'avocado'
        })
        .expect('Content-Type', /json/)
        .expect((res) => {
          delete res.body.created_at;
          delete res.body.updated_at;
        })
        .expect(200, {
          client: {
            id: 3,
            first_name: 'Al',
            last_name: 'Green',
            restrictions: [ { id: 1, name: 'bacon' },
                            { id: 3, name: 'milk' },
                            { id: 4, name: 'avocado' } ]
          }
        }, done)
      });
});
