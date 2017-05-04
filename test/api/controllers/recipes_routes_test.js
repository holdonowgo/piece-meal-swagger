"use strict";

process.env.NODE_ENV = "test";
const {suite, test} = require("mocha");
const request = require("supertest");
const bcrypt = require("bcrypt");
const knex = require("../../../knex");
const server = require("../../../app");
const authToken = process.env.AUTH_TOKEN;

const deleteIngredientTimestamps = function(res) {
    for (let recipe of res.body.recipes) {
        for (let ingredient of recipe.ingredients) {
            delete ingredient.created_at;
            delete ingredient.updated_at;
        }
    }
};

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

    test("GET /recipes/1/favorites", (done) => {
        request(server).get("/api/v1/recipes/1/favorites")
                       .set("Accept", "application/json")
                       .set('token', authToken)
                       .expect("Content-Type", /json/)
                       .expect((res) => {
            deleteIngredientTimestamps(res);
        }).expect(200, {
            "recipes": [

                  {
                      "active": true,
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
                              "description": "",
                              "image_url": "",
                              // "tags": ['dairy', 'vegetarian']
                          }
                      ],
                      "name": "cauliflower buffalo bites",
                      "description": '',
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
                      "notes": "" // "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
                  },
                  {
                      "active": true,
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
                      "notes": ""
                  },
                  {
                      "active": true,
                      "id": 5,
                      "ingredients": [
                          {
                              "active": true,
                              "id": 21,
                              "name": "garlic",
                              "description": "",
                              // "tags": [],
                              "image_url": ""
                          }, {
                              "active": true,
                              "id": 22,
                              "name": "onion",
                              "description": "",
                              // "tags": [],
                              "image_url": ""
                          }, {
                              "active": true,
                              "id": 23,
                              "name": "asafoetida (powder)",
                              "description": "",
                              // "tags": [],
                              "image_url": ""
                          }
                      ],
                      "image_url": "",
                      "instructions": [], // "It's Friday night.",
                      "name": "Recipe #5",
                      "description": '',
                      "notes": ""
                  }
            ]
        }, done);
    });

    test("GET /recipes", (done) => {
        request(server).get("/api/v1/recipes")
                       .set("Accept", "application/json")
                      //  .set('token', authToken)
                       .expect("Content-Type", /json/)
                       .expect((res) => {
            deleteIngredientTimestamps(res);
        }).expect(200, {
            "recipes": [
                {
                    "active": true,
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
                            "description": "",
                            "image_url": "",
                            // "tags": ['dairy', 'vegetarian']
                        }
                    ],
                    "name": "cauliflower buffalo bites",
                    "description": '',
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
                    "notes": "" // "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
                },
                {
                    "active": true,
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
                    "notes": ""
                },
                {
                    "active": true,
                    "id": 4,
                    "ingredients": [
                        {
                            "active": true,
                            "id": 17,
                            "name": "lemon juice (fresh)",
                            "description": "",
                            // "tags": [],
                            "image_url": ""
                        }, {
                            "active": true,
                            "id": 18,
                            "name": "salt",
                            "description": "",
                            // "tags": [],
                            "image_url": ""
                        }
                    ],
                    "image_url": "",
                    "instructions": [], // "This is how we do it.",
                    "name": "Recipe #4",
                    "description": '',
                    "notes": ""
                },
                {
                    "active": true,
                    "id": 5,
                    "ingredients": [
                        {
                            "active": true,
                            "id": 21,
                            "name": "garlic",
                            "description": "",
                            // "tags": [],
                            "image_url": ""
                        }, {
                            "active": true,
                            "id": 22,
                            "name": "onion",
                            "description": "",
                            // "tags": [],
                            "image_url": ""
                        }, {
                            "active": true,
                            "id": 23,
                            "name": "asafoetida (powder)",
                            "description": "",
                            // "tags": [],
                            "image_url": ""
                        }
                    ],
                    "image_url": "",
                    "instructions": [], // "It's Friday night.",
                    "name": "Recipe #5",
                    "description": '',
                    "notes": ""
                },
                {
                    "active": true,
                    "id": 6,
                    "image_url": "",
                    "ingredients": [],
                    "instructions": [], // "And I'm feelin' right.",
                    "name": "Recipe #6",
                    "description": '',
                    "notes": ""
                },
                {
                    "active": true,
                    "id": 7,
                    "image_url": "",
                    "ingredients": [],
                    "instructions": [], // "The party's over on the west side.",
                    "name": "Recipe #7",
                    "description": '',
                    "notes": ""
                },
                {
                    "active": true,
                    "id": 8,
                    "image_url": "",
                    "ingredients": [],
                    "instructions": [], // "So I creep...",
                    "name": "Recipe #8",
                    "description": '',
                    "notes": ""
                },
                {
                    "active": true,
                    "id": 2,
                    "name": "simple oatmeal",
                    "description": '',
                    "image_url": "",
                    "instructions": [], //"1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil.",
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
                    "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!"
                }
            ]
        }, done);
    });

    test("POST /recipes", () => {
        return request(server).post("/api/v1/recipes").set("Accept", "application/json").set('token', authToken).send({
            name: "seaweed salad",
            description: 'A flavorful, spicy, quick and simple Asian salad.',
            image_url: "",
            instructions: [
                {
                    step_number: 1,
                    instructions: 'Soak seaweed in warm water to cover, 5 minutes. Drain, rinse then squeeze out excess water. If wakame is uncut, cut into 1/2-inch-wide strips.'
                }, {
                    step_number: 2,
                    instructions: `Stir together vinegar, soy sauce, sesame oil, sugar, pepper flakes, ginger, and garlic in a bowl until sugar is dissolved.
                                   Add the seaweed, scallions, carrots, and cilantro, tossing to combine well.
                                   Sprinkle salad with sesame seeds.`
                }
            ],
            ingredients: [1, 3],
            tags: ['no-cook', 'asian', 'vegetarian', 'vegan']
        }).expect("Content-Type", /json/).expect(200, {
            id: 9,
            "ingredients": [
                {
                    "id": 1,
                    "name": "bacon",
                    "description": "Mmmmmmmmm...Bacon!",
                    "tags": ['meat', 'pork'],
                    "image_url": "",
                    "active": true
                }, {
                    "id": 3,
                    "name": "milk",
                    "description": '',
                    "tags": ['dairy', 'vegetarian'],
                    "image_url": "",
                    "active": true
                }
            ],
            name: "seaweed salad",
            description: 'A flavorful, spicy, quick and simple Asian salad.',
            image_url: "",
            instructions: [
                {
                    step_number: 1,
                    instructions: 'Soak seaweed in warm water to cover, 5 minutes. Drain, rinse then squeeze out excess water. If wakame is uncut, cut into 1/2-inch-wide strips.'
                }, {
                    step_number: 2,
                    instructions: `Stir together vinegar, soy sauce, sesame oil, sugar, pepper flakes, ginger, and garlic in a bowl until sugar is dissolved.
                                   Add the seaweed, scallions, carrots, and cilantro, tossing to combine well.
                                   Sprinkle salad with sesame seeds.`
                }
            ],
            "notes": '',
            tags: ['asian', 'no-cook', 'vegan', 'vegetarian'],
            active: true
        });
    });

    test("GET /recipes/:id", (done) => {
        request(server).get("/api/v1/recipes/1")
                       .set("Accept", "application/json")
                      //  .set('token', authToken)
                       .expect(200, {
            "id": 1,
            "name": "cauliflower buffalo bites",
            "description": '',
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
            ], // "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk.",
            "ingredients": [
                {
                    "id": 1,
                    "name": "bacon",
                    "description": "Mmmmmmmmm...Bacon!",
                    "tags": ['meat', 'pork'],
                }, {
                    "id": 3,
                    "name": "milk",
                    "description": "",
                    "tags": ['dairy', 'vegetarian']
                }
            ],
            "tags": [],
            "active": true
        });

        request(server).get("/api/v1/recipes/2")
                       .set("Accept", "application/json")
                      //  .set('token', authToken)
                       .expect(200, {
            "id": 2,
            "name": "simple oatmeal",
            "description": '',
            "image_url": "",
            "instructions": [], //"1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil.",
            "ingredients": [
                {
                  "id": 1,
                  "name": "bacon",
                  "tags": ['meat', 'pork'],
                  "description": "Mmmmmmmmm...Bacon!",
                  "image_url": "",
                  "active": true
                }
            ],
            "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
            "tags": [],
            "active": true
        }, done);
    });

    // test("POST /recipes/2/ratings", (done) => {
    //     request(server).get("/api/v1/recipes/2").set("Accept", "application/json").set('token', authToken).expect(200, {
    //         "id": 2,
    //         "name": "simple oatmeal",
    //         "description": '',
    //         "image_url": "",
    //         "instructions": [],
    //         "ingredients": [
    //             {
    //                 "id": 1,
    //                 "name": "bacon",
    //                 "description": "Mmmmmmmmm...Bacon!",
    //                 "tags": ['meat', 'pork'],
    //                 "image_url": "",
    //                 "active": true
    //             }
    //         ],
    //         "notes": "",
    //         "active": true,
    //         "tags": [],
    //         "ratings": {"up_votes": 0, "down_votes": 0}
    //     });
    //
    //     request(server).post("/api/v1/recipes/2/ratings").set("Accept", "application/json").set('token', authToken).send({
    //         "recipe_id": 2,
    //         "client_id": 1,
    //         "vote": -1
    //     }).expect("Content-Type", /json/).expect(200, {
    //         "id": 2,
    //         "name": "simple oatmeal",
    //         "description": '',
    //         "image_url": "",
    //         "instructions": [],
    //         "ingredients": [
    //             {
    //                 "id": 1,
    //                 "name": "bacon",
    //                 "description": "Mmmmmmmmm...Bacon!",
    //                 "tags": ['meat', 'pork'],
    //                 "image_url": "",
    //                 "active": true
    //             }
    //         ],
    //         "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
    //         "tags": [],
    //         "active": true,
    //         "ratings": {"up_votes": 0, "down_votes": -1}
    //     });
    //
    //     request(server).post("/api/v1/recipes/2/ratings").set("Accept", "application/json").set('token', authToken).send({
    //         "recipe_id": 2,
    //         "client_id": 1,
    //         "vote": 1
    //     }).expect("Content-Type", /json/).expect(200, {
    //         "id": 2,
    //         "name": "simple oatmeal",
    //         "description": '',
    //         "image_url": "",
    //         "instructions": [],
    //         "ingredients": [
    //             {
    //                 "id": 1,
    //                 "name": "bacon",
    //                 "description": "Mmmmmmmmm...Bacon!",
    //                 "tags": ['meat', 'pork'],
    //                 "image_url": "",
    //                 "active": true
    //             }
    //         ],
    //         "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
    //         "tags": [],
    //         "active": true,
    //         "ratings": {"up_votes": 1, "down_votes": 0}
    //     }, done);
    // });

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
                    "tags": ['meat', 'pork'],
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
                    "tags": ['meat', 'pork'],
                    "image_url": "",
                    "active": true
                }
            ],
            "notes": "Bacon Bacon BACON!",
            "tags": ['breakfast', 'sweet'],
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
            deleteIngredientTimestamps(res);
        }).expect(200, {
            "recipes": [
                {
                    "id": 1,
                    "name": "cauliflower buffalo bites",
                    "description": '',
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
                            "image_url": ""
                        }, {
                            "id": 3,
                            "name": "milk",
                            "active": true,
                            // "tags": ['dairy', 'vegetarian'],
                            "description": "",
                            "image_url": ""
                        }
                    ],
                    "notes": "",
                    "active": true
                }, {
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
                            "image_url": ""
                        }
                    ],
                    "notes": "",
                    "active": true
                }, {
                    "id": 2,
                    "name": "simple oatmeal",
                    "description": '',
                    "image_url": "",
                    "instructions": [], // "1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil.",
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
                    "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
                    "active": true
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
            return request(server).get("/api/v1/clients/2/recipes").set("Accept", "application/json").set('token', authToken).expect((res) => {
                deleteIngredientTimestamps(res);
            }).expect(200, {
                "recipes": [
                    {
                        "id": 1,
                        "name": "cauliflower buffalo bites",
                        "description": '',
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
                                "image_url": ""
                            }, {
                                "id": 3,
                                "name": "milk",
                                "active": true,
                                // "tags": ['dairy', 'vegetarian'],
                                "description": "",
                                "image_url": ""
                            }
                        ],
                        "notes": "",
                        // "tags": [],
                        "active": true
                    }
                ]
            });
        });
    });

    test('GET /search/recipes/?text=mi', (done) => {
        request(server)
            .get('/api/v1/search/recipes?text=d')
            .set('Accept', 'application/json')
            .set('Token', authToken)
            .expect('Content-Type', /json/)
            .expect(200,
              {
                "recipes": [
                {
                  "active": true,
                  "description": "",
                  "id": 5,
                  "image_url": "",
                  "ingredients": [
                    {
                      "active": true,
                      "description": "",
                      "id": 21,
                      "name": "garlic",
                      "image_url": ""
                    },
                    {
                      "active": true,
                      "description": "",
                      "id": 22,
                      "name": "onion",
                      "image_url": ""
                    },
                    {
                      "active": true,
                      "description": "",
                      "id": 23,
                      "name": "asafoetida (powder)",
                      "image_url": ""
                    }
                  ],
                  "instructions": [],
                  "name": "Recipe #5",
                  "notes": ""
                },
                {
                  "active": true,
                  "description": "",
                  "id": 1,
                  "image_url": "",
                  "ingredients": [
                    {
                      "active": true,
                      "description": "Mmmmmmmmm...Bacon!",
                      "id": 1,
                      "name": "bacon",
                      "image_url": ""
                    },
                    {
                      "active": true,
                      "description": "",
                      "id": 3,
                      "name": "milk",
                      "image_url": ""
                    }
                  ],
                  "instructions": [
                    {
                      "instructions": "do step one",
                      "step_number": 1
                    },
                    {
                      "instructions": "do step two",
                      "step_number": 2
                    },
                    {
                      "instructions": "do step three",
                      "step_number": 3
                    },
                    {
                      "instructions": "do step four",
                      "step_number": 4
                    },
                    {
                      "instructions": "do step five",
                      "step_number": 5
                    }
                  ],
                  "name": "cauliflower buffalo bites",
                  "notes": ""
                },
                {
                  "active": true,
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
                    },
                    {
                      "instructions": "Place a small non-stick frying pan on a low heat to warm up.",
                      "step_number": 2
                    }
                  ],
                  "name": "cheese omelette",
                  "notes": ""
                }
              ]
            }, done);
    });

    test("GET /recipes/-1", (done) => {
      request(server)
        .get("/api/v1/recipes/-1")
        .set("Accept", "application/json")
        .expect(404, JSON.stringify('Not Found'), done);
    });

    test("GET /recipes/-1", (done) => {
      request(server)
        .get("/api/v1/recipes/-1")
        .set("Accept", "application/json")
        .set('Token', authToken)
        .expect(404, JSON.stringify('Not Found'), done);
    });

    test("GET /recipes/one", (done) => {
      request(server)
        .get("/api/v1/recipes/one")
        .set("Accept", "application/json")
        // .set('Token', authToken)
        .expect(400, JSON.stringify(
          {
            "message":"Request validation failed: Parameter (id) is not a valid integer: one",
            "code":"INVALID_TYPE",
            "failedValidation":true,
            "path":["paths",
            "/recipes/{id}",
            "get","parameters","0"],
            "paramName":"id"
          }), done);
    });

});
