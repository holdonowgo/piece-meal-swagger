const notes = `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`;

const data = [{
  id: 1,
  name: "cauliflower buffalo bites",
  description: `Beetroot water spinach okra water chestnut ricebean pea catsear courgette summer purslane. Water spinach arugula pea tatsoi aubergine spring onion bush tomato kale radicchio turnip chicory salsify pea sprouts fava bean. Dandelion zucchini burdock yarrow chickpea dandelion sorrel courgette turnip greens tigernut soybean radish artichoke wattle seed endive groundnut broccoli arugula.`,
  notes: notes,
  image_url: 'http://nanaslittlekitchen.com/wp-content/uploads/2016/12/Cauli-Bites-Main.png'
}, {
  id: 2,
  name: "simple oatmeal",
  description: `Pea horseradish azuki bean lettuce avocado asparagus okra. Kohlrabi radish okra azuki bean corn fava bean mustard tigernut jÃ­cama green bean celtuce collard greens avocado quandong fennel gumbo black-eyed pea. Grape silver beet watercress potato tigernut corn groundnut. Chickweed okra pea winter purslane coriander yarrow sweet pepper radish garlic brussels sprout groundnut summer purslane earthnut pea tomato spring onion azuki bean gourd. Gumbo kakadu plum komatsuna black-eyed pea green bean zucchini gourd winter purslane silver beet rock melon radish asparagus spinach.`,
  notes: "There is a no-cook version of this known as 'Overnight Oats'.  Check it out!",
  image_url: "https://silk.com/sites/default/files/recipes/medium/Oatmeal_shutterstock_173846588_RT.gif"
}, {
  id: 3,
  name: "cheese omelette",
  description: "Great when making breakfast for the family!  Can be eaten cold too!",
  notes: notes,
  image_url: "http://www.mrbreakfast.com/images/1135_fluffy_cheese_omelette.jpg"
}, {
  id: 4,
  name: "root vegetable stew",
  description: `Celery quandong swiss chard chicory earthnut pea potato. Salsify taro catsear garlic gram celery bitterleaf wattle seed collard] greens nori. Grape wattle seed kombu beetroot horseradish carrot squash brussels sprout chard.`,
  notes: notes,
  image_url: "http://assets.simplyrecipes.com/wp-content/uploads/2014/03/roasted-root-vegetables-tomatoes-kale-vertical-a2-1200.jpg"
}, {
  id: 5,
  name: "nori rice onigiri",
  description: `Japanese Comfort food`,
  notes: "Onigiri is my little boy's favorite lunch to take to school",
  image_url: "http://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/1/29/0/FN_Onigiri-Rice-Balls_s4x3.jpg.rend.hgtvcom.616.462.jpeg"
}, {
  id: 6,
  name: "daikon salad",
  description: `Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.`,
  notes: notes,
  image_url: "http://www.ktasuperstores.com/public/kta/recipes/DaikonSalad_20130130.jpg"
}, {
  id: 7,
  name: "beet gumbo",
  description: `Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.`,
  notes: notes,
  image_url: "http://peasandpeonies.com/wp-content/uploads/2015/09/IMG_9280.jpg"
}, {
  id: 8,
  name: "rice bean",
  description: `Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter purslane kale. Celery potato scallion desert raisin horseradish spinach carrot soko. Lotus root water spinach fennel kombu maize bamboo shoot green bean swiss chard seakale pumpkin onion chickpea gram corn pea. Brussels sprout coriander water chestnut gourd swiss chard wakame kohlrabi beetroot carrot watercress. Corn amaranth salsify bunya nuts nori azuki bean chickweed potato bell pepper artichoke.`,
  notes: notes,
  image_url: "https://32lxcujgg9-flywheel.netdna-ssl.com/wp-content/uploads/2013/04/IMG_7367.jpg"
}, {
  id: 9,
  name: "pineapple fried rice",
  description: `Thai-style sweet and spicy pineapple fried rice with chicken and shrimp.`,
  notes: 'Make sure you use a day-old rice to prevent sogginess. This recipe is passed down from my grand-mother. I loved having it for dinner as a little girl. My daughter now loves it too!',
  image_url: "https://www.gimmesomeoven.com/wp-content/uploads/2010/05/pineapple-fried-rice-4.jpg"
},

];

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
