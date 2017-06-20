"use strict";

process.env.NODE_ENV = "test";
const {suite, test} = require("mocha");
const request = require("supertest");
const bcrypt = require("bcrypt");
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

  // test("GET /random", (done) => {
  //     request(server).get("/api/v1/random")
  //                    .set("Accept", "application/json")
  //                   //  .set('token', authToken)
  //                    .expect("Content-Type", /json/)
  //                    .expect((res) => {
  //         deleteIngredientTimestamps(res);
  //     }).expect(200, {
  //         "recipes": [
  //             {
  //                 "active": true,
  //                 "id": 1,
  //                 "image_url": "",
  //                 "ingredients": [
  //                     {
  //                         "active": true,
  //                         "id": 1,
  //                         "name": "bacon",
  //                         // "tags": ['meat', 'pork'],
  //                         "description": "Mmmmmmmmm...Bacon!",
  //                         "image_url": ""
  //                     }, {
  //                         "active": true,
  //                         "id": 3,
  //                         "name": "milk",
  //                         "description": "",
  //                         "image_url": "",
  //                         // "tags": ['dairy', 'vegetarian']
  //                     }
  //                 ],
  //                 name: "cauliflower buffalo bites",
  //                 description: '',
  //                 "image_url": "",
  //                 instructions: [
  //                     {
  //                         "instructions": "do step one",
  //                         "step_number": 1
  //                     }, {
  //                         "instructions": "do step two",
  //                         "step_number": 2
  //                     }, {
  //                         "instructions": "do step three",
  //                         "step_number": 3
  //                     }, {
  //                         "instructions": "do step four",
  //                         "step_number": 4
  //                     }, {
  //                         "instructions": "do step five",
  //                         "step_number": 5
  //                     }
  //                 ],
  //                 "notes": "" // "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
  //             }, {
  //                 "active": true,
  //                 "id": 2,
  //                 "name": "simple oatmeal",
  //                 "description": '',
  //                 "image_url": "",
  //                 "instructions": [], //"1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil.",
  //                 "ingredients": [
  //                     {
  //                         "id": 1,
  //                         "name": "bacon",
  //                         "active": true,
  //                         // "tags": ['meat', 'pork'],
  //                         "description": "Mmmmmmmmm...Bacon!",
  //                         "image_url": ""
  //                     }
  //                 ],
  //                 "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!"
  //             }, {
  //                 "active": true,
  //                 "id": 3,
  //                 "name": "cheese omelette",
  //                 "description": "Great when making breakfast for the family!  Can be eaten cold too!",
  //                 "image_url": "",
  //                 "instructions": [
  //                     {
  //                         "instructions": "Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.",
  //                         "step_number": 1
  //                     }, {
  //                         "instructions": "Place a small non-stick frying pan on a low heat to warm up.",
  //                         "step_number": 2
  //                     }
  //                 ],
  //                 "ingredients": [
  //                     {
  //                         "id": 1,
  //                         "name": "bacon",
  //                         "active": true,
  //                         // "tags": ['meat', 'pork'],
  //                         "description": "Mmmmmmmmm...Bacon!",
  //                         "image_url": ""
  //                     }
  //                 ],
  //                 "notes": ""
  //             }, {
  //                 "active": true,
  //                 "id": 4,
  //                 "ingredients": [
  //                     {
  //                         "active": true,
  //                         "id": 17,
  //                         "name": "lemon juice (fresh)",
  //                         "description": "",
  //                         // "tags": [],
  //                         "image_url": ""
  //                     }, {
  //                         "active": true,
  //                         "id": 18,
  //                         "name": "salt",
  //                         "description": "",
  //                         // "tags": [],
  //                         "image_url": ""
  //                     }
  //                 ],
  //                 "image_url": "",
  //                 "instructions": [], // "This is how we do it.",
  //                 "name": "Recipe #4",
  //                 "description": '',
  //                 "notes": ""
  //             }, {
  //                 "active": true,
  //                 "id": 5,
  //                 "ingredients": [
  //                     {
  //                         "active": true,
  //                         "id": 21,
  //                         "name": "garlic",
  //                         "description": "",
  //                         // "tags": [],
  //                         "image_url": ""
  //                     }, {
  //                         "active": true,
  //                         "id": 22,
  //                         "name": "onion",
  //                         "description": "",
  //                         // "tags": [],
  //                         "image_url": ""
  //                     }, {
  //                         "active": true,
  //                         "id": 23,
  //                         "name": "asafoetida (powder)",
  //                         "description": "",
  //                         // "tags": [],
  //                         "image_url": ""
  //                     }
  //                 ],
  //                 "image_url": "",
  //                 "instructions": [], // "It's Friday night.",
  //                 "name": "Recipe #5",
  //                 "description": '',
  //                 "notes": ""
  //             }, {
  //                 "active": true,
  //                 "id": 6,
  //                 "image_url": "",
  //                 "ingredients": [],
  //                 "instructions": [], // "And I'm feelin' right.",
  //                 "name": "Recipe #6",
  //                 "description": '',
  //                 "notes": ""
  //             }, {
  //                 "active": true,
  //                 "id": 7,
  //                 "image_url": "",
  //                 "ingredients": [],
  //                 "instructions": [], // "The party's over on the west side.",
  //                 "name": "Recipe #7",
  //                 "description": '',
  //                 "notes": ""
  //             }, {
  //                 "active": true,
  //                 "id": 8,
  //                 "image_url": "",
  //                 "ingredients": [],
  //                 "instructions": [], // "So I creep...",
  //                 "name": "Recipe #8",
  //                 "description": '',
  //                 "notes": ""
  //             }
  //         ]
  //     }, done);
  // });

  test("GET /clients/1/recipes/favorites", (done) => {
    request(server).get("/api/v1/clients/1/recipes/favorites")
    .set("Accept", "application/json")
    .set('token', authToken)
    .expect("Content-Type", /json/)
    .expect((res) => {
      deleteRecipesTimestamps(res);
    }).expect(200, {
      "recipes": [
        {
          "active": true,
          "cook_time": null,
          "id": 1,
          "image_url": "",
          "ingredients": [
            {
              "active": true,
              "id": 1,
              "name": "bacon",
              // "tags": ['meat', 'pork'],
              "description": "Mmmmmmmmm...Bacon!",
              "image_url": ""
            }, {
              "active": true,
              "id": 3,
              "name": "milk",
              "description": description,
              "image_url": "",
              // "tags": ['dairy', 'vegetarian']
            }
          ],
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
          "notes": notes,
          "prep_time": null
        }, {
          "active": true,
          "cook_time": null,
          "id": 3,
          "name": "cheese omelette",
          "description": "Great when making breakfast for the family!  Can be eaten cold too!",
          "image_url": "",
          "instructions": [
            {
              "instructions": "Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.",
              "step_number": 1
            }, {
              "instructions": "Place a small non-stick frying pan on a low heat to warm up.",
              "step_number": 2
            }
          ],
          "ingredients": [
            {
              "id": 1,
              "name": "bacon",
              "active": true,
              // "tags": ['meat', 'pork'],
              "description": "Mmmmmmmmm...Bacon!",
              "image_url": ""
            }
          ],
          "notes": notes,
          "prep_time": null
        }, {
          "active": true,
          "cook_time": null,
          "id": 5,
          "ingredients": [
            {
              "active": true,
              "id": 21,
              "name": "garlic",
              "description": description,
              // "tags": [],
              "image_url": ""
            }, {
              "active": true,
              "id": 22,
              "name": "onion",
              "description": description,
              // "tags": [],
              "image_url": ""
            }, {
              "active": true,
              "id": 23,
              "name": "asafoetida (powder)",
              "description": description,
              // "tags": [],
              "image_url": ""
            }
          ],
          "image_url": "",
          "instructions": [],
          "name": "Recipe #5",
          "description": description_5,
          "notes": notes,
          "prep_time": null
        }
      ]
    }, done);
  });

  test("GET /recipes", (done) => {
    request(server).get("/api/v1/recipes").set("Accept", "application/json")
    //  .set('token', authToken)
    .expect("Content-Type", /json/).expect((res) => {
      deleteRecipesTimestamps(res);
    }).expect(200, {
      "recipes": [
        {
          "active": true,
          "cook_time": null,
          "id": 1,
          "image_url": "",
          "ingredients": [
            {
              "active": true,
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
              ],
              "id": 1,
              "name": "bacon",
              "tags": ['meat', 'pork'],
              "description": "Mmmmmmmmm...Bacon!",
              "image_url": ""
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
              "name": "milk",
              "description": description,
              "image_url": "",
              "tags": ['dairy', 'vegetarian']
            }
          ],
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
          "notes": notes,
          "prep_time": null,
          "tags": ["vegan", "vegetarian"]
        }, {
          "active": true,
          "cook_time": null,
          "id": 3,
          "name": "cheese omelette",
          "description": "Great when making breakfast for the family!  Can be eaten cold too!",
          "image_url": "",
          "instructions": [
            {
              "instructions": "Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.",
              "step_number": 1
            }, {
              "instructions": "Place a small non-stick frying pan on a low heat to warm up.",
              "step_number": 2
            }
          ],
          "ingredients": [
            {
              "id": 1,
              "name": "bacon",
              "active": true,
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
              ],
              "tags": ['meat', 'pork'],
              "description": "Mmmmmmmmm...Bacon!",
              "image_url": ""
            }
          ],
          "notes": notes,
          "prep_time": null,
          "tags": ["dairy", "vegetarian"]
        }, {
          "active": true,
          "cook_time": null,
          "id": 4,
          "ingredients": [
            {
              "active": true,
              "alternatives": [],
              "id": 17,
              "name": "lemon juice (fresh)",
              "description": description,
              "tags": [],
              "image_url": ""
            }, {
              "active": true,
              "alternatives": [
                {
                  "active": true,
                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                  "id": 17,
                  "image_url": "",
                  "name": "lemon juice (fresh)"
                }
              ],
              "id": 18,
              "name": "salt",
              "description": description,
              "tags": [],
              "image_url": ""
            }
          ],
          "image_url": "",
          "instructions": [],
          "name": "Recipe #4",
          "description": description_4,
          "notes": notes,
          "prep_time": null,
          "tags": ["vegan", "vegetarian"]
        }, {
          "active": true,
          "cook_time": null,
          "id": 5,
          "ingredients": [
            {
              "active": true,
              "alternatives": [],
              "id": 21,
              "name": "garlic",
              "description": description,
              "tags": [],
              "image_url": ""
            }, {
              "active": true,
              "alternatives": [],
              "id": 22,
              "name": "onion",
              "description": description,
              "tags": [],
              "image_url": ""
            }, {
              "active": true,
              "alternatives": [],
              "id": 23,
              "name": "asafoetida (powder)",
              "description": description,
              "tags": [],
              "image_url": ""
            }
          ],
          "image_url": "",
          "instructions": [],
          "name": "Recipe #5",
          "description": description_5,
          "notes": notes,
          "prep_time": null,
          "tags": []
        }, {
          "active": true,
          "cook_time": null,
          "id": 6,
          "image_url": "",
          "ingredients": [],
          "instructions": [],
          "name": "Recipe #6",
          "description": description,
          "notes": notes,
          "prep_time": null,
          "tags": []
        }, {
          "active": true,
          "cook_time": null,
          "id": 7,
          "image_url": "",
          "ingredients": [],
          "instructions": [],
          "name": "Recipe #7",
          "description": description_7,
          "notes": notes,
          "prep_time": null,
          "tags": []
        }, {
          "active": true,
          "cook_time": null,
          "id": 8,
          "image_url": "",
          "ingredients": [],
          "instructions": [],
          "name": "Recipe #8",
          "description": description_8,
          "notes": notes,
          "prep_time": null,
          "tags": []
        }, {
          "active": true,
          "cook_time": null,
          "id": 2,
          "name": "simple oatmeal",
          "description": description_2,
          "image_url": "",
          "instructions": [],
          "ingredients": [
            {
              "id": 1,
              "name": "bacon",
              "active": true,
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
              ],
              "tags": ['meat', 'pork'],
              "description": "Mmmmmmmmm...Bacon!",
              "image_url": ""
            }
          ],
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "prep_time": null,
          "tags": ["vegetarian"]
        }
      ]
    }, done);
  });

  test("POST /recipes", () => {
    return request(server).post("/api/v1/recipes").set("Accept", "application/json").set('token', authToken).send({
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
        1, 3
      ],
      tags: ['no-cook', 'asian', 'vegetarian', 'vegan']
    }).expect("Content-Type", /json/)
      .expect((res) => {
        deleteRecipeTimestamps(res);
    }).expect(200, {
      id: 9,
      "ingredients": [
        {
          "id": 1,
          "name": "bacon",
          "description": "Mmmmmmmmm...Bacon!",
          "tags": [
            'meat', 'pork'
          ],
          "image_url": "",
          "active": true,
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
          "description": description,
          "tags": [
            'dairy', 'vegetarian'
          ],
          "image_url": "",
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
          ]
        }
      ],
      name: "seaweed salad",
      "cook_time": null,
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
      "notes": '',
      "prep_time": null,
      tags: [
        'asian', 'no-cook', 'vegan', 'vegetarian'
      ],
      active: true
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
          "active": true,
          "id": 1,
          "image_url": "",
          "name": "bacon",
          "description": "Mmmmmmmmm...Bacon!",
          "tags": [
            'meat', 'pork'
          ],
          "alternatives": [
            {
              "active": true,
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 2,
              "image_url": "",
              "name": "egg"
            }, {
              "active": true,
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 3,
              "image_url": "",
              "name": "milk"
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
      "tags": ['vegan', 'vegetarian'],
      "active": true,
      'lol': false
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
      "image_url": "",
      "instructions": [],
      "ingredients": [
        {
          "id": 1,
          "name": "bacon",
          "tags": [
            'meat', 'pork'
          ],
          "description": "Mmmmmmmmm...Bacon!",
          "image_url": "",
          "active": true,
          "alternatives": [
            {
              "active": true,
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 2,
              "image_url": "",
              "name": "egg"
            }, {
              "active": true,
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 3,
              "image_url": "",
              "name": "milk"
            }
          ]
        }
      ],
      "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
      "prep_time": null,
      "tags": ['vegetarian'],
      "active": true
    }, done);
  });

  test("POST /recipes/2/ratings", (done) => {
      request(server).get("/api/v1/recipes/2").set("Accept", "application/json").set('token', authToken).expect(200, {
          "id": 2,
          "name": "simple oatmeal",
          "description": "Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean   corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.",
          "image_url": "",
          "instructions": [],
          "ingredients": [
              {
                  "id": 1,
                  "name": "bacon",
                  "description": "Mmmmmmmmm...Bacon!",
                  "tags": ['meat', 'pork'],
                  "image_url": "",
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
          "image_url": "",
          "instructions": [],
          "ingredients": [
              {
                  "id": 1,
                  "name": "bacon",
                  "description": "Mmmmmmmmm...Bacon!",
                  "tags": ['meat', 'pork'],
                  "image_url": "",
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
      }).expect("Content-Type", /json/).expect(200, {
          "id": 2,
          "name": "simple oatmeal",
          "description": "Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.",
          "image_url": "",
          "instructions": [],
          "ingredients": [
              {
                  "id": 1,
                  "name": "bacon",
                  "description": "Mmmmmmmmm...Bacon!",
                  "tags": ['meat', 'pork'],
                  "image_url": "",
                  "active": true
              }
          ],
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "tags": ["vegetarian"],
          "active": true,
          // "ratings": {"up_votes": 1, "down_votes": 0}
      }, done);
  });

  test("PUT /recipes:id", (done) => {
    request(server).get("/api/v1/recipes/2").set("Accept", "application/json").set('token', authToken).expect(200, {
      "id": 2,
      "name": "simple oatmeal",
      "description": '',
      "image_url": "",
      "instructions": [],
      "ingredients": [
        {
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
      "active": true,
      "tags": []
    });

    request(server).put("/api/v1/recipes/2").set("Accept", "application/json").set('token', authToken).send({
      "id": 2,
      "name": "simple maple oatmeal",
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
      "ingredients": [1],
      "notes": "Bacon Bacon BACON!",
      "tags": ['breakfast', 'sweet']
    }).expect("Content-Type", /json/).expect(200, {
      "id": 2,
      "name": "simple maple oatmeal",
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
      "notes": "Bacon Bacon BACON!",
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
    request(server).get("/api/v1/clients/1/recipes").set("Accept", "application/json").set('token', authToken).expect((res) => {
      deleteRecipesTimestamps(res);
    }).expect(200, {
      "recipes": [
        {
          "cook_time": null,
          "id": 1,
          "name": "cauliflower buffalo bites",
          "description": description_1,
          "image_url": "",
          instructions: [
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
              // "tags": ['meat', 'pork'],
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
                },
              ],
              "tags": [
                "meat",
                "pork"
              ]
            }, {
              "id": 3,
              "name": "milk",
              "active": true,
              // "tags": ['dairy', 'vegetarian'],
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
               ],
               "tags": ["dairy", "vegetarian"]
            }
          ],
          "notes": notes,
          "prep_time": null,
          "active": true,
          "tags": ["vegan", "vegetarian"]
        }, {
          "cook_time": null,
          "id": 3,
          "name": "cheese omelette",
          "description": 'Great when making breakfast for the family!  Can be eaten cold too!',
          "image_url": "",
          "instructions": [
            {
              "instructions": "Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.",
              "step_number": 1
            }, {
              "instructions": "Place a small non-stick frying pan on a low heat to warm up.",
              "step_number": 2
            }
          ],
          "ingredients": [
            {
              "id": 1,
              "name": "bacon",
              "active": true,
              // "tags": ['meat', 'pork'],
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
              ],
              "tags": ["meat", "pork"]
            }
          ],
          "notes": notes,
          "prep_time": null,
          "active": true,
          "tags": ["dairy", "vegetarian"]
        }, {
          "cook_time": null,
          "id": 2,
          "name": "simple oatmeal",
          "description": description_2,
          "image_url": "",
          "instructions": [],
          "ingredients": [
            {
              "id": 1,
              "name": "bacon",
              "active": true,
              // "tags": ['meat', 'pork'],
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
              ],
              "tags": ["meat", "pork"]
            }
          ],
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "prep_time": null,
          "active": true,
          "tags": ["vegetarian"]
        }
      ]
    }, done);
  });

  test("POST /clients/2/recipes", () => {
    return request(server).post("/api/v1/clients/2/recipes").set("Accept", "application/json").set('token', authToken).send({recipe_id: 1}).expect(200, {
      success: 1,
      description: "Added"
    }).then(() => {
      // check that it was actually added.
      return request(server).get("/api/v1/clients/2/recipes")
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
  });

  test('GET /search/recipes/?text=mi', (done) => {
    request(server).get('/api/v1/search/recipes?text=d')
    .set('Accept', 'application/json')
    .set('Token', authToken)
    .expect('Content-Type', /json/)
    .expect((res) => {
      deleteRecipesTimestamps(res);
    }).expect(200, {
      "recipes": [
        {
          "active": true,
          "cook_time": null,
          "description": description_4,
          "id": 4,
          "ingredients": [
            {
              "active": true,
              "id": 17,
              "name": "lemon juice (fresh)",
              "description": description,
              // "tags": [],
              "image_url": ""
            }, {
              "active": true,
              "id": 18,
              "name": "salt",
              "description": description,
              // "tags": [],
              "image_url": ""
            }
          ],
          "image_url": "",
          "instructions": [],
          "name": "Recipe #4",
          "notes": notes,
          "prep_time": null
        }, {
          "active": true,
          "cook_time": null,
          "description": description_5,
          "id": 5,
          "image_url": "",
          "ingredients": [
            {
              "active": true,
              "description": description,
              "id": 21,
              "name": "garlic",
              "image_url": ""
            }, {
              "active": true,
              "description": description,
              "id": 22,
              "name": "onion",
              "image_url": ""
            }, {
              "active": true,
              "description": description,
              "id": 23,
              "name": "asafoetida (powder)",
              "image_url": ""
            }
          ],
          "instructions": [],
          "name": "Recipe #5",
          "notes": notes,
          "prep_time": null
        }, {
          "active": true,
          "cook_time": null,
          "description": description_1,
          "id": 1,
          "image_url": "",
          "ingredients": [
            {
              "active": true,
              "description": "Mmmmmmmmm...Bacon!",
              "id": 1,
              "name": "bacon",
              "image_url": ""
            }, {
              "active": true,
              "description": description,
              "id": 3,
              "name": "milk",
              "image_url": ""
            }
          ],
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
          "name": "cauliflower buffalo bites",
          "notes": notes,
          "prep_time": null
        }, {
          "active": true,
          "cook_time": null,
          "description": "Great when making breakfast for the family!  Can be eaten cold too!",
          "id": 3,
          "image_url": "",
          "ingredients": [
            {
              "active": true,
              "description": "Mmmmmmmmm...Bacon!",
              "id": 1,
              "name": "bacon",
              "image_url": ""
            }
          ],
          "instructions": [
            {
              "instructions": "Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.",
              "step_number": 1
            }, {
              "instructions": "Place a small non-stick frying pan on a low heat to warm up.",
              "step_number": 2
            }
          ],
          "name": "cheese omelette",
          "notes": notes,
          "prep_time": null
        }, {
          "active": true,
          "cook_time": null,
          "description": description_2,
          "id": 2,
          "image_url": "",
          "instructions": [],
          "ingredients": [
            {
              "id": 1,
              "name": "bacon",
              "active": true,
              // "tags": ['meat', 'pork'],
              "description": "Mmmmmmmmm...Bacon!",
              "image_url": ""
            }
          ],
          "name": "simple oatmeal",
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "prep_time": null
        }
      ]
    }, done);
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
