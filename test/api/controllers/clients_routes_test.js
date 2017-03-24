/*jshint esversion: 6 */
// 'use strict';

process.env.NODE_ENV = 'test';

const {
    suite,
    test
} = require('mocha');
const request = require('supertest');
const bcrypt = require('bcrypt');
const knex = require('../../../knex');
const server = require('../../../app');
const assert = require('chai').assert;

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
                        "is_super_user": false,
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
                        "is_super_user": false,
                        "recipes": []
                    },
                    {
                        "id": 3,
                        "first_name": 'Randall',
                        "last_name": 'Spencer',
                        "email": 'randy.spence@gmail.com',
                        "is_super_user": true,
                        "recipes": []
                    },
                    {
                        "id": 4,
                        "first_name": 'Aom',
                        "last_name": 'Sithanant',
                        "email": 'aom.sithanant@gmail.com',
                        "is_super_user": true,
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
                "is_super_user": false,
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
            });

        request(server)
            .get('/clients/4')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                "id": 4,
                "first_name": 'Aom',
                "last_name": 'Sithanant',
                "email": 'aom.sithanant@gmail.com',
                "is_super_user": true,
                "recipes": []
            }, done);

        /* eslint-enable max-len */
    });

    test('GET /search/clients/?email=aom', (done) => {
        request(server)
            .get('/search/clients/?last_name=ant')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                clients: [{
                    "id": 4,
                    "first_name": 'Aom',
                    "last_name": 'Sithanant',
                    "email": 'aom.sithanant@gmail.com',
                    "is_super_user": true,
                    "recipes": []
                }]
            }, done);
    });

    // test('GET /clients/88', (done) => {
    //     request(server)
    //         .get('/clients/88')
    //         .set('Accept', 'text/plain')
    //         .expect('Content-Type', 'application/json')
    //         .expect(404, 'Not Found', done);
    //
    //     /* eslint-enable max-len */
    // });


    test('POST /clients', (done) => {
        const password = 'ilikebigcats';

        request(server)
            .post('/clients')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                first_name: 'John',
                last_name: 'Siracusa',
                email: 'john.siracusa@gmail.com',
                password
            })
            .expect((res) => {
                delete res.body.created_at;
                delete res.body.updated_at;
            })
            .expect(200, {
                id: 5,
                first_name: 'John',
                last_name: 'Siracusa',
                email: 'john.siracusa@gmail.com',
                is_super_user: false
            })
            .expect('Content-Type', /json/)
            .end((httpErr, _res) => {
                if (httpErr) {
                    return done(httpErr);
                }

                knex('clients')
                    .where('id', 5)
                    .first()
                    .then((client) => {
                        const hashedPassword = client.hashed_password;

                        delete client.hashed_password;
                        delete client.created_at;
                        delete client.updated_at;

                        assert.deepEqual(client, {
                            id: 5,
                            first_name: 'John',
                            last_name: 'Siracusa',
                            email: 'john.siracusa@gmail.com',
                            is_super_user: false
                        });

                        // eslint-disable-next-line no-sync
                        const isMatch = bcrypt.compareSync(password, hashedPassword);

                        assert.isTrue(isMatch, "passwords don't match");
                        done();
                    })
                    .catch((dbErr) => {
                        done(dbErr);
                    });
            });
    });


    test('POST /clients/:id/restrictions', (done) => {
        request(server)
            .post('/clients/2/restrictions')
            .set('Accept', 'application/json')
            .send({
                ingredient_id: 4
            })
            .expect('Content-Type', /json/)
            .expect(200, {
                success: 1,
                description: 'Restriction has been added'
            }, done)
    });

    test('GET /clients/:id/restrictions', (done) => {
        request(server)
            .get('/clients/2/restrictions')
            .set('Accept', 'application/json')
            .expect(200, {
                ingredients: [{
                    id: 1,
                    name: 'bacon'
                }, {
                    id: 3,
                    name: 'milk'
                }]
            }, done);
    });

    test('DELETE /clients/:id/restrictions', (done) => {
        request(server)
            .del('/clients/2/restrictions')
            .set('Accept', 'application/json')
            .send({
                ingredient_id: 2
            })
            .expect('Content-Type', /json/)
            .expect(200, {
                success: 1,
                description: 'Restriction has been deleted'
            }, done);
    });
    //
});
