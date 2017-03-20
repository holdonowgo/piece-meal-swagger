'use strict';

process.env.NODE_ENV = 'test';
const {
  suit,
  test
} = require('mocha');
const request = require('supertest');
const bcrypt = require('bcrypt');
const knex = require('../../../knex');
const server = require('../../../app');

suite('recipes test', () => {
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

  test('GET /recipes', (done) => {
    request(server)
      .get('/recipes')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        "recipes": [{
          id: 1,
          name: 'cauliflower buffalo bites',
          instruction: '1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk.'
        }, {
          id: 2,
          name: 'simple oatmeal',
          instruction: '1.Place 3/4 cup of the rolled oats into a blender and process until a flour.\
                      \n2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil.'
        }, {
          id: 3,
          name: 'cheese omelette',
          instruction: '1.Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.\
                      \n2.Place a small non-stick frying pan on a low heat to warm up.'
        }]
      }, done);
  });

  test('GET /recipes/:id', (done) => {
    request(server)
      .get('/recipes/1')
      .set('Accept', 'application/json')
      .expect(200, {
        "id": 1,
        "name": "cauliflower buffalo bites",
        "instruction": "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
      }, done);
  });

  test('POST /recipes', (done) => {
    request(server)
      .post('/recipes')
      .set('Accept', 'application/json')
      .send({
        name: 'seaweed salad',
        instruction: '1.Soak seaweed in warm water to cover, 5 minutes. Drain, rinse then squeeze out excess water. If wakame is uncut, cut into 1/2-inch-wide strips.\
        \n2.Stir together vinegar, soy sauce, sesame oil, sugar, pepper flakes, ginger, and garlic in a bowl until sugar is dissolved. Add the seaweed, scallions, carrots, and cilantro, tossing to combine well. Sprinkle salad with sesame seeds.'
      })
  })









  // ------------------------------------------
});
