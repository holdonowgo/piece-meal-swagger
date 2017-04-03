"use strict";

process.env.NODE_ENV = "test";
const {
    suite,
    test
} = require("mocha");
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

    test("GET /recipes", (done) => {
        request(server)
            .get("/api/v1/recipes")
            .set("Accept", "application/json")
            .set('token', authToken)
            .expect("Content-Type", /json/)
            .expect((res) => {
                deleteIngredientTimestamps(res);
            })
            .expect(200, {
                "recipes": [{
                        id: 1,
                        "ingredients": [{
                                "active": true,
                                "id": 1,
                                "name": "bacon",
                            },
                            {
                                "active": true,
                                "id": 3,
                                "name": "milk",
                            }
                        ],
                        name: "cauliflower buffalo bites",
                        instructions: "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
                    },
                    {
                        "id": 2,
                        "name": "simple oatmeal",
                        "instructions": "1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil.",
                        "ingredients": [{
                            "id": 1,
                            "name": "bacon",
                            "active": true
                        }]
                    },
                    {
                        "id": 3,
                        "name": "cheese omelette",
                        "instructions": "1.Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.2.Place a small non-stick frying pan on a low heat to warm up.",
                        "ingredients": [{
                            "id": 1,
                            "name": "bacon",
                            "active": true
                        }]
                    },
                    {
                        "id": 4,
                        "ingredients": [{
                                "active": true,
                                "id": 17,
                                "name": "lemon juice (fresh)"
                            },
                            {
                                "active": true,
                                "id": 18,
                                "name": "salt"
                            }
                        ],
                        "instructions": "This is how we do it.",
                        "name": "Recipe #4"
                    },
                    {
                        "id": 5,
                        "ingredients": [{
                                "active": true,
                                "id": 21,
                                "name": "garlic"
                            },
                            {
                                "active": true,
                                "id": 22,
                                "name": "onion"
                            },
                            {
                                "active": true,
                                "id": 23,
                                "name": "asafoetida (powder)"
                            }
                        ],
                        "instructions": "It's Friday night.",
                        "name": "Recipe #5"
                    },
                    {
                        "id": 6,
                        "ingredients": [],
                        "instructions": "And I'm feelin' right.",
                        "name": "Recipe #6"
                    },
                    {
                        "id": 7,
                        "ingredients": [],
                        "instructions": "The party's over on the west side.",
                        "name": "Recipe #7"
                    },
                    {
                        "id": 8,
                        "ingredients": [],
                        "instructions": "So I creep...",
                        "name": "Recipe #8"
                    }
                ]
            }, done);
    });

    test("POST /recipes", () => {
        return request(server)
            .post("/api/v1/recipes")
            .set("Accept", "application/json")
            .set('token', authToken)
            .send({
                name: "seaweed salad",
                instructions: "1.Soak seaweed in warm water to cover, 5 minutes. Drain, rinse then squeeze out excess water. If wakame is uncut, cut into 1/2-inch-wide strips.2.Stir together vinegar, soy sauce, sesame oil, sugar, pepper flakes, ginger, and garlic in a bowl until sugar is dissolved. Add the seaweed, scallions, carrots, and cilantro, tossing to combine well. Sprinkle salad with sesame seeds.",
                ingredients: [1, 3]
            })
            .expect("Content-Type", /json/)
            .expect(200, {
                id: 9,
                "ingredients": [{
                        "id": 1,
                        "name": "bacon"
                    },
                    {
                        "id": 3,
                        "name": "milk"
                    }
                ],
                name: "seaweed salad",
                instructions: "1.Soak seaweed in warm water to cover, 5 minutes. Drain, rinse then squeeze out excess water. If wakame is uncut, cut into 1/2-inch-wide strips.2.Stir together vinegar, soy sauce, sesame oil, sugar, pepper flakes, ginger, and garlic in a bowl until sugar is dissolved. Add the seaweed, scallions, carrots, and cilantro, tossing to combine well. Sprinkle salad with sesame seeds."
            });
    });

    test("GET /recipes/:id", (done) => {
        request(server)
            .get("/api/v1/recipes/1")
            .set("Accept", "application/json")
            .set('token', authToken)
            .expect(200, {
                "id": 1,
                "name": "cauliflower buffalo bites",
                "instructions": "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk.",
                "ingredients": [{
                        "id": 1,
                        "name": "bacon"
                    },
                    {
                        "id": 3,
                        "name": "milk"
                    }
                ]
            }, done);
    });

    test("PUT /recipes:id", (done) => {
        request(server)
            .put("/api/v1/recipes/1")
            .set("Accept", "application/json")
            .set('token', authToken)
            .send({
                name: "seaweed salad",
                instructions: "xyz"
            })
            .expect("Content-Type", /json/)
            .expect(200, {
                id: 1,
                name: "seaweed salad",
                instructions: "xyz"
            }, done);
    });

    test("DELETE /recipes/:id", (done) => {
        request(server)
            .del("/api/v1/recipes/1")
            .set("Accept", "application/json")
            .set('token', authToken)
            .expect("Content-Type", /json/)
            .expect(200, {
                name: "cauliflower buffalo bites",
                instructions: "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk."
            }, done);
    });

    test("GET /clients/1/recipes", (done) => {
        request(server)
            .get("/api/v1/clients/1/recipes")
            .set("Accept", "application/json")
            .set('token', authToken)
            .expect((res) => {
                deleteIngredientTimestamps(res);
            })
            .expect(200, {
                "recipes": [{
                        "id": 1,
                        "name": "cauliflower buffalo bites",
                        "instructions": "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk.",
                        "ingredients": [{
                                "id": 1,
                                "name": "bacon",
                                "active": true
                            },
                            {
                                "id": 3,
                                "name": "milk",
                                "active": true
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "name": "simple oatmeal",
                        "instructions": "1.Place 3/4 cup of the rolled oats into a blender and process until a flour.2.Add all rolled oats, water, cinnamon and vanilla to pan and bring to a boil.",
                        "ingredients": [{
                            "id": 1,
                            "name": "bacon",
                            "active": true
                        }]
                    },
                    {
                        "id": 3,
                        "name": "cheese omelette",
                        "instructions": "1.Crack the eggs into a mixing bowl, season with a pinch of sea salt and black pepper, then beat well with a fork until fully combined.2.Place a small non-stick frying pan on a low heat to warm up.",
                        "ingredients": [{
                            "id": 1,
                            "name": "bacon",
                            "active": true
                        }]
                    }
                ]
            }, done);
    });

    test("POST /clients/2/recipes", () => {
        return request(server)
            .post("/api/v1/clients/2/recipes")
            .set("Accept", "application/json")
            .set('token', authToken)
            .send({
                recipe_id: 1
            })
            .expect(200, {
                success: 1,
                description: "Added"
            }).then(() => {
                // check that it was actually added.
                return request(server)
                    .get("/api/v1/clients/2/recipes")
                    .set("Accept", "application/json")
                    .set('token', authToken)
                    .expect((res) => {
                        deleteIngredientTimestamps(res);
                    })
                    .expect(200, {
                        "recipes": [{
                            "id": 1,
                            "name": "cauliflower buffalo bites",
                            "instructions": "1.Preheat oven to 450F.2.In a small bowl, combine brown rice flour, water, garlic powder and salt. Mix thoroughly with a whisk.",
                            "ingredients": [{
                                    "id": 1,
                                    "name": "bacon",
                                    "active": true
                                },
                                {
                                    "id": 3,
                                    "name": "milk",
                                    "active": true
                                }
                            ]
                        }]
                    });
            });
    });

    // test("GET /recipes/-1", (done) => {
    //   request(server)
    //     .get("/api/v1/recipes/-1")
    //     .set("Accept", "application/json")
    //     .expect("Content-Type", /plain/)
    //     .expect(404, "Not Found", done);
    // });
    //
    // test("GET /recipes/one", (done) => {
    //   request(server)
    //     .get("/api/v1/recipes/one")
    //     .set("Accept", "application/json")
    //     .expect("Content-Type", /plain/)
    //     .expect(404, "Not Found", done);
    // });

});
