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

suite('part4 routes token', () => {
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

    // test('GET /token without token', (done) => {
    //   request(server)
    //     .get('/token')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(200, 'false', done);
    // });

    // // Test Facebook Auth0
    // test('GET /token without token', (done) => {
    //   request(server)
    //     .get('/token')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(
    //       200,
    //       {
    //         "error": "access_denied",
    //         "error_description": "Permissions error"
    //       }, done);
    // });


    test('POST /token', (done) => {
        request(server)
            .post('/api/v1/token')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({
                email: 'marvin.gaye@gmail.com',
                password: 'youreawizard'
            })
            // .expect('set-cookie', /token=[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+; Path=\/;.+HttpOnly/)
            .expect((res) => {
                delete res.body.created_at;
                delete res.body.updated_at;
            })
            // .expect(200, {
            //     id: 1,
            //     first_name: 'Marvin',
            //     last_name: 'Gaye',
            //     email: 'marvin.gaye@gmail.com',
            //     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTQ5MDIyNTYyNSwiZXhwIjoxNDkwODMwNDI1fQ.yE6nfHVcTHcqb1RVgy_rJic2YYEcskalB-tw2rzr9rk"
            // })
            .expect(200)
            .expect(hasToken)
            .expect('Content-Type', /json/)
            .end(done);
    });

    function hasToken(res) {
      console.log(res.headers.token)
      if (!('token' in res.body)) throw new Error("Token is missing!");
      if (!('token' in res.headers)) throw new Error("Token is missing!");
      if (!('id' in res.body)) throw new Error("ID is missing!");
      if (!('email' in res.body)) throw new Error("Email is missing!");
      // if (!('super' in res.body)) throw new Error("Super user status is missing!");
    }

    // test('GET /token with token', (done) => {
    //   const agent = request.agent(server);
    //
    //   request(server)
    //     .post('/token')
    //     .set('Accept', 'application/json')
    //     .set('Content-Type', 'application/json')
    //     .send({
    //       email: 'jkrowling@gmail.com',
    //       password: 'youreawizard'
    //     })
    //     .end((err, res) => {
    //       if (err) {
    //         return done(err);
    //       }
    //
    //       agent.saveCookies(res);
    //
    //       agent
    //         .get('/token')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .expect(200, 'true', done);
    //     });
    // });

    // test('DELETE /token', (done) => {
    //   request(server)
    //     .del('/token')
    //     .set('Accept', 'application/json')
    //     .expect('set-cookie', /token=; Path=\//)
    //     .expect(200)
    //     .end(done);
    // });

    // test('POST /token with bad email', (done) => {
    //   request(server)
    //     .post('/token')
    //     .set('Accept', 'application/json')
    //     .set('Content-Type', 'application/json')
    //     .send({
    //       email: 'bad.email@gmail.com',
    //       password: 'youreawizard'
    //     })
    //     .expect('Content-Type', /plain/)
    //     .expect(400, 'Bad email or password', done);
    // });

    // test('POST /token with bad password', (done) => {
    //   request(server)
    //     .post('/token')
    //     .set('Accept', 'application/json')
    //     .set('Content-Type', 'application/json')
    //     .send({
    //       email: 'jkrowling@gmail.com',
    //       password: 'badpassword'
    //     })
    //     .expect('Content-Type', /plain/)
    //     .expect(400, 'Bad email or password', done);
    // });
});
