'use strict';

process.env.NODE_ENV = 'test';

const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const knex = require('../../../knex');
const { suite, test } = require('mocha');

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
            "name": "bacon"
          },
          {
            "id": 2,
            "name": "egg"
          },
          {
            "id": 3,
            "name": "milk"
          },
          {
            "id": 4,
            "name": "avocado"
          }
        ]
      }, done);
  });
});
