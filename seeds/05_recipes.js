const notes = `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`;

const data = [{
  id: 1,
  name: "cauliflower buffalo bites",
  description: `Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula.`,
  notes: notes
}, {
  id: 2,
  name: "simple oatmeal",
  notes: "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
  description: `Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.`,
  notes: "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!"
}, {
  id: 3,
  name: "cheese omelette",
  description: "Great when making breakfast for the family!  Can be eaten cold too!",
  notes: notes
}, {
  id: 4,
  name: "Recipe #4",
  description: `Celery quandong swiss chard chicory earthnut pea potato. Salsify taro catsear garlic gram celery bitterleaf wattle seed collard] greens nori. Grape wattle seed kombu beetroot horseradish carrot squash brussels sprout chard.`,
  notes: notes
}, {
  id: 5,
  name: "Recipe #5",
  description: `Nori grape silver beet broccoli kombu beet greens fava bean potato quandong celery. Bunya nuts black-eyed pea prairie turnip leek lentil turnip greens parsnip. Sea lettuce lettuce water chestnut eggplant winter purslane fennel azuki bean earthnut pea sierra leone bologi leek soko chicory celtuce parsley jÃ­cama salsify.`,
  notes: notes
}, {
  id: 6,
  name: "Recipe #6",
  description: `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`,
  notes: notes
}, {
  id: 7,
  name: "Recipe #7",
  description: `Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.`,
  notes: notes
}, {
  id: 8,
  name: "Recipe #8",
  description: `Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.`,
  notes: notes
}];

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("recipes").del()
    .then(function () {
      // Inserts seed entries
      return knex("recipes").insert(data);
    })
    .then(function() {
      return knex.raw("SELECT setval('recipes_id_seq', (SELECT MAX(id) from recipes));");
    });
};
