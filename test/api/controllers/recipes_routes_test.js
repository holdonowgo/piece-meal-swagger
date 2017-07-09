"use strict";

process.env.NODE_ENV = "test";
const {suite, test} = require("mocha");
const request = require("supertest");
const expect = require('chai').expect;
const bcrypt = require("bcrypt-nodejs-as-promised");
const knex = require("../../../knex");
const server = require("../../../app");
const authToken = process.env.AUTH_TOKEN;

export const deleteRecipesTimestamps = function(res) {
  for (let recipe of res.body.recipes) {
    delete recipe.created_at;
    delete recipe.updated_at;

    for (let ingredient of recipe.ingredients) {
      delete ingredient.created_at;
      delete ingredient.updated_at;
    }
  }
};

export const deleteRecipeTimestamps = function(res) {
  delete res.body.created_at;
  delete res.body.updated_at;

  for (let ingredient of res.body.ingredients) {
    delete ingredient.created_at;
    delete ingredient.updated_at;
  }
};

const notes = `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`;

const description = `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`;

const baconDescription = "Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula.";

const description_1 = "Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula.";

const description_2 = "Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.";

const description_3 = "Great when making breakfast for the family!  Can be eaten cold too!";

const description_4 = "Celery quandong swiss chard chicory earthnut pea potato. Salsify taro catsear garlic gram celery bitterleaf wattle seed collard] greens nori. Grape wattle seed kombu beetroot horseradish carrot squash brussels sprout chard.";

const description_5 = "Nori grape silver beet broccoli kombu beet greens fava bean potato quandong celery. Bunya nuts black-eyed pea prairie turnip leek lentil turnip greens parsnip. Sea lettuce lettuce water chestnut eggplant winter purslane fennel azuki bean earthnut pea sierra leone bologi leek soko chicory celtuce parsley jÃ­cama salsify.";

const description_7 = "Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.";

const description_8 = "Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.";

suite("recipes test", () => {
  before((done) => {
    knex.migrate.latest().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

  beforeEach((done) => {
    knex.seed.run().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

  test("GET /clients/1/recipes/favorites", (done) => {
    request(server).get("/api/v1/clients/1/recipes/favorites")
    .set("Accept", "application/json")
    .set('token', authToken)
    .expect("Content-Type", /json/)
    .expect((res) => {
      // expect(res.body.recipes[0]).have.keys(['created_at', 'created_by', 'updated_at']);
      deleteRecipesTimestamps(res);
    }).expect(200, (err, res) => {
        expect(res.body.recipes[0]).to.deep.equal({
            "active": true,
            "cook_time": null,
            "created_by": null,
            "id": 1,
            "image_url": "http://nanaslittlekitchen.com/wp-content/uploads/2016/12/Cauli-Bites-Main.png",
            "ingredients": [
              {
                "active": true,
                "alternatives": [
                  {
                    "active": true,
                    "description": "treated by cold or hot smoke-curing",
                    "id": 47,
                    "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
                    "name": "smoked cheddar"
                  },
                  {
                    "active": true,
                    "description": "chicken skin is good for rendering fat to use for cooking",
                    "id": 48,
                    "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
                    "name": "chicken skin",
                  }
                ],
                "amount": null,
                "id": 1,
                "name": "bacon",
                "tags": ['meat', 'pork'],
                "description": "Mmmmmmmmm...Bacon!",
                "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg"
              }, {
                "active": true,
                "alternatives": [
                  {
                    "active": true,
                    "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                    "id": 5,
                    "image_url": "https://cdn.authoritynutrition.com/wp-content/uploads/2016/11/almonds-and-almond-milk-large.jpg",
                    "name": "almond milk"
                  },
                  {
                    "active": true,
                    "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                    "id": 6,
                    "image_url": "https://cdn.authoritynutrition.com/wp-content/uploads/2016/07/coconuts-and-coconut-milk-facebook.jpg",
                    "name": "coconut milk"
                  }
                ],
                "amount": null,
                "id": 3,
                "name": "milk",
                "description": description,
                "image_url": "http://i.ndtvimg.com/i/2015-05/milk-day-625_625x350_71433091943.jpg",
                "tags": ['dairy', 'vegetarian']
              }
            ],
            "name": "cauliflower buffalo bites",
            "description": description_1,
            "image_url": "http://nanaslittlekitchen.com/wp-content/uploads/2016/12/Cauli-Bites-Main.png",
            "instructions": [
              {
                "instructions": "do step one",
                "step_number": 1
              }, {
                "instructions": "do step two",
                "step_number": 2
              }, {
                "instructions": "do step three",
                "step_number": 3
              }, {
                "instructions": "do step four",
                "step_number": 4
              }, {
                "instructions": "do step five",
                "step_number": 5
              }
            ],
            "notes": notes,
            "prep_time": null,
            "tags": ["meat", "pork"]
          }
        );

        expect(res.body.recipes[res.body.recipes.length - 1]).to.deep.equal(
          {
            "active": true,
            "cook_time": null,
            "created_by": null,
            "description": "Japanese Comfort food",
            "id": 5,
            "image_url": "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/1/29/0/FN_Onigiri-Rice-Balls_s4x3.jpg.rend.hgtvcom.616.462.jpeg",
            "ingredients": [
              {
                "active": true,
                "alternatives": [],
                "amount": "1/4 cup",
                "description": "dried, fermented, and smoked skipjack tuna",
                "id": 45,
                "image_url": "https://www.groxers.com/images/thumbnails/4/984/732/SSS-015.jpg",
                "name": "bonito flakes",
                "tags": []
              },
              {
                "active": true,
                "alternatives": [],
                "amount": "4 cups",
                "description": "Japanese short-grain rice is soft and fluffy",
                "id": 41,
                "image_url": "http://www.justonecookbook.com/wp-content/uploads/2012/09/Rice-II.jpg",
                "name": "Japanese short-grain rice",
                "tags": [],
              },
              {
                "active": true,
                "alternatives": [],
                "amount": "2 sheets",
                "description": "pre-toasted nori seaweed sheets",
                "id": 43,
                "image_url": "http://superhumancoach.com/wp-content/uploads/2013/08/nori-seaweed.jpg",
                "name": "nori",
                "tags": []
              },
              {
              "active": true,
              "alternatives": [],
              "amount": "2 large",
              "description": "pitted removed and coursely chopped",
              "id": 44,
              "image_url": "http://www.realfoodforlife.com/wp-content/uploads/2013/12/Umeboshi-plum.jpg",
              "name": "pickle plums",
              "tags": []
              },
              {
                "active": true,
                "alternatives": [],
                "amount": "1/2 pound",
                "description": "wild salmon is less fatty than farmed salmon",
                "id": 40,
                "image_url": "http://atmedia.imgix.net/bb2d554cde83f7440bbe92dc67705a968cb31d1c?w=800&fit=max",
                "name": "salmon fillet",
                "tags": []
              },
              {
                "active": true,
                "alternatives": [],
                "amount": "2 Tbsp",
                "description": "Sesame is a flowering plant in the genus Sesamum, also called benne",
                "id": 46,
                "image_url": "https://www.organicfacts.net/wp-content/uploads/2013/08/sesameseeds.jpg",
                "name": "sesame seeds",
                "tags": []
              },
              {
                "active": true,
                "alternatives": [],
                "amount": "1 1/2 tsp",
                "description": "Soy sauce is a condiment made from a fermented paste of boiled soybeans, roasted grain, brine, and Aspergillus oryzae or Aspergillus sojae molds",
                "id": 34,
                "image_url": "http://www.carlagoldenwellness.com/wp-content/uploads/2015/09/blog-soya-sauce.jpg",
                "name": "soy sauce",
                "tags": []
              }
            ],
            "instructions": [],
            "name": "nori rice onigiri",
            "notes": "Onigiri is my little boy's favorite lunch to take to school",
            "prep_time": null,
            "tags": [
              "kosher",
              "nuts",
              "seafood",
              "soy",
              "wheat"
            ]
          });
        done();
      });
  });

  test("GET /recipes", (done) => {
    request(server).get("/api/v1/recipes").set("Accept", "application/json")
    //  .set('token', authToken)
    .expect("Content-Type", /json/)
    .expect((res) => {
      // expect(res.body.recipes[0]).have.keys(['created_at', 'created_by', 'updated_at']);
    })
    .expect((res) => {
      deleteRecipesTimestamps(res);
    })
    .expect(200, (err, res) => {
        expect(res.body.recipes[0]).to.deep.equal({
          "active": true,
          "cook_time": null,
          "created_by": null,
          "description": "Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.",
          "id": 7,
          "image_url": "http://peasandpeonies.com/wp-content/uploads/2015/09/IMG_9280.jpg",
          "ingredients": [],
          "instructions": [],
          "name": "beet gumbo",
          "notes": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "prep_time": null,
          "tags": []
          }
        )

        expect(res.body.recipes[res.body.recipes.length - 1]).to.deep.equal({
          "active": true,
          "cook_time": null,
          "created_by": null,
          "description": "Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.",
          "id": 2,
          "image_url": "https://silk.com/sites/default/files/recipes/medium/Oatmeal_shutterstock_173846588_RT.gif",
          "ingredients": [
            {
              "active": true,
              "alternatives": [
                {
                  "active": true,
                  "description": "treated by cold or hot smoke-curing",
                  "id": 47,
                  "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
                  "name": "smoked cheddar"
                },
                {
                  "active": true,
                  "description": "chicken skin is good for rendering fat to use for cooking",
                  "id": 48,
                  "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
                  "name": "chicken skin"
                }
              ],
              "amount": null,
              "description": "Mmmmmmmmm...Bacon!",
              "id": 1,
              "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
              "name": "bacon",
              "tags": [
                "meat",
                "pork"
              ]
            }
          ],
          "instructions": [],
          "name": "simple oatmeal",
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "prep_time": null,
          "tags": [
            "kosher",
            "vegan",
            "vegetarian"
          ]
        });
        done();
    });
  });

  test("POST /recipes", () => {
    return request(server)
    .post("/api/v1/recipes")
    .set("Accept", "application/json")
    .set('token', authToken)
    .send({
      name: "seaweed salad",
      description: 'A flavorful, spicy, quick and simple Asian salad.',
      image_url: "https://www.splendidtable.org/sites/default/files/wakame.jpg",
      instructions: [
        {
          step_number: 1,
          instructions: 'Soak seaweed in warm water to cover, 5 minutes. Drain, rinse then squeeze out excess water. If wakame is uncut, cut into 1/2-inch-wide strips.'
        }, {
          step_number: 2,
          instructions: `Stir together vinegar, soy sauce, sesame oil, sugar, pepper flakes, ginger, and garlic in a bowl until sugar is dissolved.  Add the seaweed, scallions, carrots, and cilantro, tossing to combine well.  Sprinkle salad with sesame seeds.`
        }
      ],
      ingredients: [
        { id: 1, amount: '1 cup' },
        { id: 3, amount: '2 tbsp' }
      ],
      tags: ['no-cook', 'asian', 'vegetarian', 'vegan']
    }).expect("Content-Type", /json/)
      .expect((res) => {
        deleteRecipeTimestamps(res);
    }).expect(200, {
        "active": true,
        "cook_time": null,
        "created_by": 1,
        "description": "A flavorful, spicy, quick and simple Asian salad.",
        "id": 10,
        "image_url": "https://www.splendidtable.org/sites/default/files/wakame.jpg",
        "ingredients": [
          {
            "active": true,
            "alternatives": [
               {
                 "active": true,
                "description": "treated by cold or hot smoke-curing",
                "id": 47,
                "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
                "name": "smoked cheddar"
              },
               {
                 "active": true,
                "description": "chicken skin is good for rendering fat to use for cooking",
                "id": 48,
                "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
                "name": "chicken skin"
               }
             ],
            "amount": "1 cup",
            "description": "Mmmmmmmmm...Bacon!",
            "id": 1,
            "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
            "name": "bacon",
            "tags": [
              "meat",
              "pork"
            ]
          },
          {
            "active": true,
            "alternatives": [
              {
                "active": true,
                "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                "id": 5,
                "image_url": "https://cdn.authoritynutrition.com/wp-content/uploads/2016/11/almonds-and-almond-milk-large.jpg",
                "name": "almond milk"
              },
              {
                "active": true,
                "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                "id": 6,
                "image_url": "https://cdn.authoritynutrition.com/wp-content/uploads/2016/07/coconuts-and-coconut-milk-facebook.jpg",
                "name": "coconut milk"
              }
            ],
            "amount": "2 tbsp",
            "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
            "id": 3,
            "image_url": "http://i.ndtvimg.com/i/2015-05/milk-day-625_625x350_71433091943.jpg",
            "name": "milk",
            "tags": [
              "dairy",
              "vegetarian"
            ]
          }
        ],
        "instructions": [
          {
            "instructions": "Soak seaweed in warm water to cover, 5 minutes. Drain, rinse then squeeze out excess water. If wakame is uncut, cut into 1/2-inch-wide strips.",
            "step_number": 1
          },
          {
            "instructions": "Stir together vinegar, soy sauce, sesame oil, sugar, pepper flakes, ginger, and garlic in a bowl until sugar is dissolved.  Add the seaweed, scallions, carrots, and cilantro, tossing to combine well.  Sprinkle salad with sesame seeds.",
            "step_number": 2
          }
        ],
        "name": "seaweed salad",
        "notes": "",
        "prep_time": null,
        "source_recipe_id": null,
        "tags": [
          "asian",
          "no-cook",
          "vegan",
          "vegetarian"
        ]
    });
  });

  test("GET /recipes/:id", (done) => {
    request(server).get("/api/v1/recipes/1").set("Accept", "application/json")
    //  .set('token', authToken)
      .expect((res) => {
        deleteRecipeTimestamps(res);
      })
      .expect(200, {
      "id": 1,
      "name": "cauliflower buffalo bites",
      "cook_time": null,
      "created_by": null,
      "description": description_1,
      "image_url": "https://silk.com/sites/default/files/recipes/medium/Oatmeal_shutterstock_173846588_RT.gif",
      "instructions": [
        {
          "instructions": "do step one",
          "step_number": 1
        }, {
          "instructions": "do step two",
          "step_number": 2
        }, {
          "instructions": "do step three",
          "step_number": 3
        }, {
          "instructions": "do step four",
          "step_number": 4
        }, {
          "instructions": "do step five",
          "step_number": 5
        }
      ],
      "ingredients": [
        {
          "active": true,
          "id": 1,
          "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
          "name": "bacon",
          "description": "Mmmmmmmmm...Bacon!",
          "tags": [
            'meat', 'pork'
          ],
          "alternatives": [
            {
              "active": true,
              "description": "treated by cold or hot smoke-curing",
              "id": 47,
              "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
              "name": "smoked cheddar"
            }, {
              "active": true,
              "description": "chicken skin is good for rendering fat to use for cooking",
               "id": 48,
               "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
               "name": "chicken skin"
            }
          ]
        }, {
          "active": true,
          "alternatives": [
            {
              "active": true,
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 5,
              "image_url": "",
              "name": "almond milk"
            },
            {
              "active": true,
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 6,
              "image_url": "",
              "name": "coconut milk"
            }
          ],
          "id": 3,
          "image_url": "",
          "name": "milk",
          "description": description,
          "tags": ['dairy', 'vegetarian']
        }
      ],
      "notes": notes,
      "prep_time": null,
      "source_recipe_id": null,
      "tags": [
        "kosher",
        "vegan",
        'vegetarian'
      ],
      "active": true
    });

    request(server).get("/api/v1/recipes/2").set("Accept", "application/json")
    //  .set('token', authToken)
      .expect((res) => {
        deleteRecipeTimestamps(res);
      })
      .expect(200, {
      "id": 2,
      "name": "simple oatmeal",
      "cook_time": null,
      "description": description_2,
      "image_url": "https://silk.com/sites/default/files/recipes/medium/Oatmeal_shutterstock_173846588_RT.gif",
      "instructions": [],
      "ingredients": [
        {
          "id": 1,
          "name": "bacon",
          "tags": [
            'meat', 'pork'
          ],
          "description": "Mmmmmmmmm...Bacon!",
          "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
          "active": true,
          "alternatives": [
            {
              "active": true,
              "description": "treated by cold or hot smoke-curing",
              "id": 47,
              "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
              "name": "smoked cheddar"
            }, {
              "active": true,
              "description": "chicken skin is good for rendering fat to use for cooking",
               "id": 48,
               "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
               "name": "chicken skin"
            }
          ]
        }
      ],
      "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
      "prep_time": null,
      "source_recipe_id": null,
      "tags": ['kosher', 'vegan', 'vegetarian'],
      "active": true
    }, done());
  });

  test("POST /recipes/2/ratings", (done) => {
      request(server).get("/api/v1/recipes/2").set("Accept", "application/json").set('token', authToken).expect(200, {
          "id": 2,
          "name": "simple oatmeal",
          "description": "Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean   corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.",
          "image_url": "https://silk.com/sites/default/files/recipes/medium/Oatmeal_shutterstock_173846588_RT.gif",
          "instructions": [],
          "ingredients": [
              {
                  "alternatives": [
                    {
                      "active": true,
                      "description": "treated by cold or hot smoke-curing",
                      "id": 47,
                      "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
                      "name": "smoked cheddar"
                    },
                    {
                      "active": true,
                      "description": "chicken skin is good for rendering fat to use for cooking",
                      "id": 48,
                      "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
                      "name": "chicken skin",
                    }
                  ],
                  "id": 1,
                  "name": "bacon",
                  "description": "Mmmmmmmmm...Bacon!",
                  "tags": ['meat', 'pork'],
                  "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
                  "active": true
              }
          ],
          "notes": "",
          "active": true,
          "tags": ["vegetarian"],
          // "ratings": { "up_votes": 0, "down_votes": 0 }
      });

      request(server).post("/api/v1/recipes/2/ratings").set("Accept", "application/json").set('token', authToken).send({
          "recipe_id": 2,
          "client_id": 1,
          "vote": -1
      }).expect("Content-Type", /json/).expect(200, {
          "id": 2,
          "name": "simple oatmeal",
          "description": "Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.",
          "image_url": "https://silk.com/sites/default/files/recipes/medium/Oatmeal_shutterstock_173846588_RT.gif",
          "instructions": [],
          "ingredients": [
              {
                  "alternatives": [
                    {
                      "active": true,
                      "description": "treated by cold or hot smoke-curing",
                      "id": 47,
                      "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
                      "name": "smoked cheddar"
                    },
                    {
                      "active": true,
                      "description": "chicken skin is good for rendering fat to use for cooking",
                      "id": 48,
                      "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
                      "name": "chicken skin",
                    }
                  ],
                  "id": 1,
                  "name": "bacon",
                  "description": "Mmmmmmmmm...Bacon!",
                  "tags": ['meat', 'pork'],
                  "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
                  "active": true
              }
          ],
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "tags": ["vegetarian"],
          "active": true,
          // "ratings": {"up_votes": 0, "down_votes": -1}
      });

      request(server).post("/api/v1/recipes/2/ratings").set("Accept", "application/json").set('token', authToken).send({
          "recipe_id": 2,
          "client_id": 1,
          "vote": 1
      }).expect((res) => {
          deleteRecipeTimestamps(res);
      }).expect("Content-Type", /json/).expect(200, {
          "id": 2,
          "name": "simple oatmeal",
          "cook_time": null,
          "created_by": null,
          "description": "Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.",
          "image_url": "https://silk.com/sites/default/files/recipes/medium/Oatmeal_shutterstock_173846588_RT.gif",
          "instructions": [],
          "ingredients": [
              {
                  "alternatives": [
                    {
                      "active": true,
                      "description": "treated by cold or hot smoke-curing",
                      "id": 47,
                      "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
                      "name": "smoked cheddar"
                    },
                    {
                      "active": true,
                      "description": "chicken skin is good for rendering fat to use for cooking",
                      "id": 48,
                      "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
                      "name": "chicken skin",
                    }
                  ],
                  "id": 1,
                  "name": "bacon",
                  "amount": null,
                  "description": "Mmmmmmmmm...Bacon!",
                  "tags": ['meat', 'pork'],
                  "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
                  "active": true
              }
          ],
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "prep_time": null,
          "source_recipe_id": null,
          "tags": ["kosher", "vegan", "vegetarian"],
          "active": true,
          // "ratings": {"up_votes": 1, "down_votes": 0}
      }, done);
  });

  test("PUT /recipes:id", (done) => {
    request(server)
    .get("/api/v1/recipes/2")
    .set("Accept", "application/json")
    .set('token', authToken)
    .expect(200, {
      "id": 2,
      "name": "simple oatmeal",
      "cook_time": 55,
      "created_by": 1,
      "description": '',
      "image_url": "",
      "instructions": [],
      "ingredients": [
        {
          "alternatives": [
            {
              "active": true,
              "description": "treated by cold or hot smoke-curing",
              "id": 47,
              "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
              "name": "smoked cheddar"
            },
            {
              "active": true,
              "description": "chicken skin is good for rendering fat to use for cooking",
              "id": 48,
              "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
              "name": "chicken skin",
            }
          ],
          "id": 1,
          "name": "bacon",
          "description": "Mmmmmmmmm...Bacon!",
          "tags": [
            'meat', 'pork'
          ],
          "image_url": "",
          "active": true
        }
      ],
      "notes": "",
      "prep_time": 20,
      "active": true,
      "source_recipe_id": null,
      "tags": []
    });

    request(server)
    .put("/api/v1/recipes/2")
    .set("Accept", "application/json")
    .set('token', authToken)
    .send({
      "id": 2,
      "name": "simple maple oatmeal",
      "cook_time": 50,
      "description": 'A delicious winter time breakfast.  Try it with crumbled bacon!',
      "image_url": "",
      "instructions": [
        {
          step_number: 1,
          instructions: "Place 3/4 cup of the rolled oats into a blender and process until a flour."
        }, {
          step_number: 2,
          instructions: "Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil."
        }
      ],
      "ingredients": [{ id: 1, amount: '2 tbsp' }],
      "notes": "Bacon Bacon BACON!",
      "prep_time": 20,
      "tags": ['breakfast', 'sweet']
    }).expect("Content-Type", /json/)
    .expect((res) => {
      deleteRecipeTimestamps(res);
    })
    .expect(200, {
      "id": 2,
      "name": "simple maple oatmeal",
      "cook_time": 50,
      "created_by": 1,
      "description": 'A delicious winter time breakfast.  Try it with crumbled bacon!',
      "image_url": "",
      "instructions": [
        {
          step_number: 1,
          instructions: "Place 3/4 cup of the rolled oats into a blender and process until a flour."
        }, {
          step_number: 2,
          instructions: "Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil."
        }
      ],
      "ingredients": [
        {
          "active": true,
          "alternatives": [
             {
               "active": true,
              "description": "treated by cold or hot smoke-curing",
              "id": 47,
              "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
              "name": "smoked cheddar"
            },
             {
               "active": true,
              "description": "chicken skin is good for rendering fat to use for cooking",
              "id": 48,
              "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
              "name": "chicken skin"
             }
           ],
          "amount": "2 tbsp",
          "description": "Mmmmmmmmm...Bacon!",
          "id": 1,
          "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
          "name": "bacon",
          "tags": [
            "meat",
            "pork"
          ]
        }
      ],
      "notes": "Bacon Bacon BACON!",
      "prep_time": 20,
      "source_recipe_id": null,
      "tags": [
        'breakfast', 'sweet'
      ],
      "active": true
    }, done);
  });

  test("DELETE /recipes/:id", (done) => {
    request(server).del("/api/v1/recipes/1").set("Accept", "application/json").set('token', authToken).expect("Content-Type", /json/).expect(200, {
      id: 1,
      name: "cauliflower buffalo bites",
      active: false, // "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
    }, done);
  });

  test("GET /clients/1/recipes", (done) => {
    request(server)
    .get("/api/v1/clients/1/recipes")
    .set("Accept", "application/json")
    .set('token', authToken)
    .expect((res) => {
      deleteRecipesTimestamps(res);
    })
    // .expect(200, (err, res) => {
    //     expect(res.body.recipes[0]).to.deep.equal(
    //       {
    //         "cook_time": null,
    //         "created_by": null,
    //         "id": 1,
    //         "name": "cauliflower buffalo bites",
    //         "description": description_1,
    //         "image_url": "http://nanaslittlekitchen.com/wp-content/uploads/2016/12/Cauli-Bites-Main.png",
    //         instructions: [
    //           {
    //             "instructions": "do step one",
    //             "step_number": 1
    //           }, {
    //             "instructions": "do step two",
    //             "step_number": 2
    //           }, {
    //             "instructions": "do step three",
    //             "step_number": 3
    //           }, {
    //             "instructions": "do step four",
    //             "step_number": 4
    //           }, {
    //             "instructions": "do step five",
    //             "step_number": 5
    //           }
    //         ],
    //         "ingredients": [
    //           {
    //             "id": 1,
    //             "name": "bacon",
    //             "active": true,
    //             // "tags": ['meat', 'pork'],
    //             "amount": null,
    //             "description": "Mmmmmmmmm...Bacon!",
    //             "image_url": "https://awol.junkee.com/wp-content/uploads/2015/06/bacon.jpg",
    //             "alternatives": [
    //               {
    //                 "active": true,
    //                 "description": "treated by cold or hot smoke-curing",
    //                 "id": 47,
    //                 "image_url": "http://www.amishfoods.com/media/catalog/product/cache/1/image/400x/9df78eab33525d08d6e5fb8d27136e95/s/m/smoked-cheddar-cheese.jpg",
    //                 "name": "smoked cheddar"
    //               },
    //               {
    //                 "active": true,
    //                 "description": "chicken skin is good for rendering fat to use for cooking",
    //                 "id": 48,
    //                 "image_url": "http://iamafoodblog.com/wp-content/uploads/2013/10/chickenarrones-1.jpg",
    //                 "name": "chicken skin"
    //               },
    //             ],
    //             "tags": [
    //               "meat",
    //               "pork"
    //             ]
    //           }, {
    //             "id": 3,
    //             "name": "milk",
    //             "active": true,
    //             // "tags": ['dairy', 'vegetarian'],
    //             "description": description,
    //             "image_url": "http://i.ndtvimg.com/i/2015-05/milk-day-625_625x350_71433091943.jpg",
    //             "alternatives": [
    //                {
    //                  "active": true,
    //                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
    //                  "id": 5,
    //                  "image_url": "https://cdn.authoritynutrition.com/wp-content/uploads/2016/11/almonds-and-almond-milk-large.jpg",
    //                  "name": "almond milk"
    //                },
    //                {
    //                  "active": true,
    //                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
    //                  "id": 6,
    //                  "image_url": "https://cdn.authoritynutrition.com/wp-content/uploads/2016/07/coconuts-and-coconut-milk-facebook.jpg",
    //                  "name": "coconut milk"
    //                }
    //              ],
    //              "amount": null,
    //              "tags": ["dairy", "vegetarian"]
    //           }
    //         ],
    //         "notes": notes,
    //         "prep_time": null,
    //         "active": true,
    //         "tags": ["meat", "pork"]
    //       }
    //     )
    //   }, done);
    .expect(200);
    done();
  });

  test("POST /clients/2/recipes", (done) => {
    request(server)
    .post("/api/v1/clients/2/recipes")
    .set("Accept", "application/json")
    .set('token', authToken)
    .send({recipe_id: 1}).expect(200, {
      success: 1,
      description: "Added"
    }).then(() => {
      // check that it was actually added.
      request(server).get("/api/v1/clients/2/recipes")
      .set("Accept", "application/json")
      .set('token', authToken)
      .expect((res) => {
        deleteRecipesTimestamps(res);
      }).expect(200, {
        "recipes": [
          {
            "cook_time": null,
            "id": 1,
            "name": "cauliflower buffalo bites",
            "description": description_1,
            "image_url": "",
            "instructions": [
              {
                "instructions": "do step one",
                "step_number": 1
              }, {
                "instructions": "do step two",
                "step_number": 2
              }, {
                "instructions": "do step three",
                "step_number": 3
              }, {
                "instructions": "do step four",
                "step_number": 4
              }, {
                "instructions": "do step five",
                "step_number": 5
              }
            ],
            "ingredients": [
              {
                "id": 1,
                "name": "bacon",
                "active": true,
                "tags": ['meat', 'pork'],
                "description": "Mmmmmmmmm...Bacon!",
                "image_url": "",
                "alternatives": [
                  {
                    "active": true,
                    "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                    "id": 2,
                    "image_url": "",
                    "name": "egg"
                  },
                  {
                    "active": true,
                    "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                    "id": 3,
                    "image_url": "",
                    "name": "milk"
                  }
                ]
              }, {
                "id": 3,
                "name": "milk",
                "active": true,
                "tags": ['dairy', 'vegetarian'],
                "description": description,
                "image_url": "",
                "alternatives": [
                  {
                    "active": true,
                    "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                    "id": 5,
                    "image_url": "",
                    "name": "almond milk"
                  },
                  {
                    "active": true,
                    "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                    "id": 6,
                    "image_url": "",
                    "name": "coconut milk"
                  }
                ]
              }
            ],
            "notes": notes,
            "tags": ["vegan", "vegetarian"],
            "prep_time": null,
            "active": true
          }
        ]
      });
    });
    done();
  });

  test('GET /search/recipes/?text=mi', (done) => {
    request(server).get('/api/v1/search/recipes?text=oatmeal')
    .set('Accept', 'application/json')
    .set('Token', authToken)
    .expect('Content-Type', /json/)
    .expect((res) => {
      deleteRecipesTimestamps(res);
    }).expect(200, (err, res) => {
        let names = res.body.recipes.map((recipe) => {
          return recipe.name;
        });

        expect(names).to.not.include('Recipe #4');
        expect(names).to.not.include('Recipe #5');
        expect(names).to.include('simple oatmeal');
        expect(names).to.not.include('cheese omelette');
        expect(names).to.not.include('cauliflower buffalo bites');
        // expect(res.body.recipes).to.have.nested.property('a.b[1]');
        // expect(res.body.recipes[0]).to.nested.include({'a.b[1]': 'y'});
      });

      done();
  });

  test("GET /recipes/-1", (done) => {
    request(server).get("/api/v1/recipes/-1")
    .set("Accept", "application/json")
    .expect(404, JSON.stringify('Not Found'), done);
  });

  test("GET /recipes/-1", (done) => {
    request(server).get("/api/v1/recipes/-1")
    .set("Accept", "application/json")
    .set('Token', authToken)
    .expect(404, JSON.stringify('Not Found'), done);
  });

  test("GET /recipes/one", (done) => {
    request(server).get("/api/v1/recipes/one")
    .set("Accept", "application/json")
    // .set('Token', authToken)
      .expect(400, JSON.stringify({
      "message": "Request validation failed: Parameter (id) is not a valid integer: one",
      "code": "INVALID_TYPE",
      "failedValidation": true,
      "path": [
        "paths", "/recipes/{id}", "get", "parameters", "0"
      ],
      "paramName": "id"
    }), done);
  });

});
