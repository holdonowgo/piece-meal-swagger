const notes = `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`;

const description = `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`;

const baconDescription = "Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula.";

const description_1 = "Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula.";

const description_2 = "Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.";

const description_3 = "Great when making breakfast for the family!  Can be eaten cold too!";

const description_4 = "Celery quandong swiss chard chicory earthnut pea potato. Salsify taro catsear garlic gram celery bitterleaf wattle seed collard] greens nori. Grape wattle seed kombu beetroot horseradish carrot squash brussels sprout chard.";

const description_5 = "Nori grape silver beet broccoli kombu beet greens fava bean potato quandong celery. Bunya nuts black-eyed pea prairie turnip leek lentil turnip greens parsnip. Sea lettuce lettuce water chestnut eggplant winter purslane fennel azuki bean earthnut pea sierra leone bologi leek soko chicory celtuce parsley jÃ­cama salsify.";

const description_6 = "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.";

const description_7 = "Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.";

const description_8 = "Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.";

export const allClients = {
  "clients": [
    {
      "id": 1,
      "first_name": 'Marvin',
      "last_name": 'Gaye',
      "email": 'marvin.gaye@gmail.com',
      "is_super_user": false,
      "recipes": [
        {
          id: 1,
          cook_time: null,
          name: "cauliflower buffalo bites",
          "description": description_1,
          image_url: '',
          instructions: [
            {
              step_number: 1,
              instructions: 'do step one'
            }, {
              step_number: 2,
              instructions: 'do step two'
            }, {
              step_number: 3,
              instructions: 'do step three'
            }, {
              step_number: 4,
              instructions: 'do step four'
            }, {
              step_number: 5,
              instructions: 'do step five'
            }
          ],
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
                }, {
                  "active": true,
                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                  "id": 3,
                  "image_url": "",
                  "name": "milk"
                }
              ],
              "description": "Mmmmmmmmm...Bacon!",
              "id": 1,
              "image_url": "",
              "name": "bacon",
              "tags": ["meat", "pork"]
            }, {
              "active": true,
              "alternatives": [
                {
                  "active": true,
                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                  "id": 5,
                  "image_url": "",
                  "name": "almond milk"
                }, {
                  "active": true,
                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                  "id": 6,
                  "image_url": "",
                  "name": "coconut milk"
                }
              ],
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 3,
              "image_url": "",
              "name": "milk",
              "tags": ["dairy", "vegetarian"]
            }
          ],
          "notes": notes,
          "prep_time": null,
          "active": true,
          "tags": [
            "vegan", "vegetarian"
          ],
          "votes": [
            {
              "client_id": 1,
              "recipe_id": 1,
              "vote": 1
            }, {
              "client_id": 2,
              "recipe_id": 1,
              "vote": 1
            }, {
              "client_id": 3,
              "recipe_id": 1,
              "vote": -1
            }
          ]
        }, {
          id: 2,
          cook_time: null,
          name: "simple oatmeal",
          "description": description_2,
          instructions: [],
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
                }, {
                  "active": true,
                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                  "id": 3,
                  "image_url": "",
                  "name": "milk"
                }
              ],
              "description": "Mmmmmmmmm...Bacon!",
              "id": 1,
              "image_url": "",
              "name": "bacon",
              "tags": ["meat", "pork"]
            }
          ],
          image_url: '',
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "prep_time": null,
          "active": true,
          "tags": ["vegetarian"],
          "votes": [
            {
              "client_id": 1,
              "recipe_id": 2,
              "vote": -1
            }, {
              "client_id": 3,
              "recipe_id": 2,
              "vote": -1
            }
          ]
        }, {
          id: 3,
          cook_time: null,
          name: "cheese omelette",
          "description": 'Great when making breakfast for the family!  Can be eaten cold too!',
          image_url: '',
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
                }, {
                  "active": true,
                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                  "id": 3,
                  "image_url": "",
                  "name": "milk"
                }
              ],
              "description": "Mmmmmmmmm...Bacon!",
              "id": 1,
              "image_url": "",
              "name": "bacon",
              "tags": ["meat", "pork"]
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
          "notes": notes,
          "prep_time": null,
          "active": true,
          "tags": [
            "dairy", "vegetarian"
          ],
          "votes": []
        }
      ],
      restrictions: []
    }, {
      "id": 2,
      "first_name": 'Al',
      "last_name": 'Green',
      "email": 'al.green@gmail.com',
      "is_super_user": false,
      "recipes": [],
      "restrictions": [
        {
          "description": "Mmmmmmmmm...Bacon!",
          "id": 1,
          "name": "bacon"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 2,
          "name": "egg"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 3,
          "name": "milk"
        }
      ]
    }, {
      "id": 3,
      "first_name": 'Randall',
      "last_name": 'Spencer',
      "email": 'randy.spence@gmail.com',
      "is_super_user": true,
      "recipes": [
        {
          "id": 2,
          image_url: '',
          instructions: [],
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
                }, {
                  "active": true,
                  "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
                  "id": 3,
                  "image_url": "",
                  "name": "milk"
                }
              ],
              "description": "Mmmmmmmmm...Bacon!",
              "id": 1,
              "image_url": "",
              "name": "bacon",
              "tags": ["meat", "pork"]
            }
          ],
          "name": "simple oatmeal",
          "cook_time": null,
          "description": description_2,
          "notes": "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
          "prep_time": null,
          "active": true,
          "tags": ["vegetarian"],
          "votes": [
            {
              "client_id": 1,
              "recipe_id": 2,
              "vote": -1
            }, {
              "client_id": 3,
              "recipe_id": 2,
              "vote": -1
            }
          ]
        }, {
          "id": 4,
          image_url: '',
          "ingredients": [
            {
              "active": true,
              "alternatives": [],
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 17,
              "image_url": "",
              "name": "lemon juice (fresh)",
              "tags": []
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
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 18,
              "image_url": "",
              "name": "salt",
              "tags": []
            }
          ],
          "instructions": [],
          "name": "Recipe #4",
          "cook_time": null,
          "description": description_4,
          "notes": notes,
          "prep_time": null,
          "active": true,
          "tags": [
            "vegan", "vegetarian"
          ],
          "votes": [
            {
              "client_id": 3,
              "recipe_id": 4,
              "vote": 1
            }, {
              "client_id": 4,
              "recipe_id": 4,
              "vote": -1
            }
          ]
        }, {
          "id": 5,
          image_url: '',
          "ingredients": [
            {
              "active": true,
              "alternatives": [],
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 23,
              "image_url": "",
              "name": "asafoetida (powder)",
              "tags": []
            }, {
              "active": true,
              "alternatives": [],
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 21,
              "image_url": "",
              "name": "garlic",
              "tags": []
            }, {
              "active": true,
              "alternatives": [],
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 22,
              "image_url": "",
              "name": "onion",
              "tags": []
            }
          ],
          "instructions": [],
          "name": "Recipe #5",
          "cook_time": null,
          "description": description_5,
          "notes": notes,
          "prep_time": null,
          "active": true,
          tags: [],
          "votes": [
            {
              "client_id": 4,
              "recipe_id": 5,
              "vote": 1
            }
          ]
        }, {
          "id": 8,
          image_url: '',
          ingredients: [],
          "instructions": [],
          "name": "Recipe #8",
          "cook_time": null,
          "description": description_8,
          "notes": notes,
          "prep_time": null,
          "active": true,
          tags: [],
          votes: []
        }
      ],
      "restrictions": [
        {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 4,
          "name": "avocado"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 3,
          "name": "milk"
        }
      ],
      "restrictions": [
        {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 4,
          "name": "avocado"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 3,
          "name": "milk"
        }
      ]
    }, {
      "id": 4,
      "first_name": 'Aom',
      "last_name": 'Sithanant',
      "email": 'aom.sithanant@gmail.com',
      "is_super_user": true,
      "recipes": [
        {
          "id": 5,
          image_url: '',
          "ingredients": [
            {
              "active": true,
              "alternatives": [],
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 23,
              "image_url": "",
              "name": "asafoetida (powder)",
              "tags": []
            }, {
              "active": true,
              "alternatives": [],
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 21,
              "image_url": "",
              "name": "garlic",
              "tags": []
            }, {
              "active": true,
              "alternatives": [],
              "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
              "id": 22,
              "image_url": "",
              "name": "onion",
              "tags": []
            }
          ],
          "instructions": [],
          "name": "Recipe #5",
          "cook_time": null,
          "description": description_5,
          "notes": notes,
          "prep_time": null,
          "active": true,
          tags: [],
          "votes": [
            {
              "client_id": 4,
              "recipe_id": 5,
              "vote": 1
            }
          ]
        }, {
          "id": 6,
          image_url: '',
          ingredients: [],
          "instructions": [],
          "name": "Recipe #6",
          "cook_time": null,
          "description": description_6,
          "notes": notes,
          "prep_time": null,
          "active": true,
          tags: [],
          "votes": [
            {
              "client_id": 4,
              "recipe_id": 6,
              "vote": -1
            }
          ]
        }, {
          "id": 7,
          image_url: '',
          ingredients: [],
          "instructions": [],
          "name": "Recipe #7",
          "cook_time": null,
          "description": description_7,
          "notes": notes,
          "prep_time": null,
          "active": true,
          tags: [],
          "votes": [
            {
              "client_id": 4,
              "recipe_id": 7,
              "vote": 1
            }
          ]
        }
      ],
      "restrictions": [
        {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 25,
          "name": "carrot"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 26,
          "name": "celery"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 2,
          "name": "egg"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 20,
          "name": "grains of paradise"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 17,
          "name": "lemon juice (fresh)"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 22,
          "name": "onion"
        }, {
          "description": "Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.",
          "id": 24,
          "name": "white flour"
        }
      ]
    }
  ]
};
