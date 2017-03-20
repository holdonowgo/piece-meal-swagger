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

const { suite, test } = require('mocha');
const request = require('supertest');
const bcrypt = require('bcrypt');
const knex = require('../../../knex');
const server = require('../../../app');

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

    test('GET /clients', (done) => {
        /* eslint-disable max-len */
        request(server)
            .get('/clients')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                "clients": [{
                    "id": 1,
                    "firstName": 'Marvin',
                    "lastName": 'Gaye',
                    "email": 'marvin.gaye@gmail.com'
                },
                {
                    "id": 2,
                    "firstName": 'Al',
                    "lastName": 'Green',
                    "email": 'al.green@gmail.com'
                }]
            }, done);
    });

    test('GET /clients/:id', (done) => {
        /* eslint-disable max-len */
        request(server)
            .get('/clients/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                "id": 2,
                "firstName": 'Marvin',
                "lastName": 'Gaye',
                "email": 'marvin.gaye@gmail.com'
            }, done);

        /* eslint-enable max-len */
    });


    test('POST /clients', (done) => {
        const password = 'ilikebigcats';

        request(server)
            .post('/clients')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                firstName: 'John',
                lastName: 'Siracusa',
                email: 'john.siracusa@gmail.com',
                password
            })
            .expect((res) => {
                delete res.body.createdAt;
                delete res.body.updatedAt;
            })
            .expect(200, {
                id: 3,
                firstName: 'John',
                lastName: 'Siracusa',
                email: 'john.siracusa@gmail.com'
            })
            .expect('Content-Type', /json/)
            .end((httpErr, _res) => {
                if (httpErr) {
                    return done(httpErr);
                }

                knex('clients')
                    .where('id', 3)
                    .first()
                    .then((client) => {
                        const hashedPassword = client.hashed_password;

                        delete client.hashed_password;
                        delete client.created_at;
                        delete client.updated_at;

                        assert.deepEqual(client, {
                            id: 2,
                            first_name: 'John',
                            last_name: 'Siracusa',
                            email: 'john.siracusa@gmail.com'
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
});
