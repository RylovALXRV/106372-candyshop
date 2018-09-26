'use strict';

(function () {

  var ingredients = [];
  var pictures = [];
  var names = [];

  var CATALOG_CARD_AMOUNT = 26;

  var GoodFeature = {
    NAME: ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно',
      'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира',
      'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша',
      'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка',
      'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'
    ],
    NutritionFacts: {
      SUGAR: [true, false],
      CONTENTS: ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца',
        'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель',
        'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид',
        'вилларибо', 'виллабаджо'
      ]
    },
    PICTURE: ['gum-cedar', 'gum-chile', 'gum-eggplant', 'gum-mustard', 'gum-portwine', 'gum-wasabi',
      'ice-cucumber', 'ice-eggplant', 'ice-garlic', 'ice-italian', 'ice-mushroom', 'ice-pig',
      'marmalade-beer', 'marmalade-caviar', 'marmalade-corn', 'marmalade-new-year', 'marmalade-sour',
      'marshmallow-bacon', 'marshmallow-beer', 'marshmallow-shrimp', 'marshmallow-spicy', 'marshmallow-wine',
      'soda-bacon', 'soda-celery', 'soda-cob', 'soda-garlic', 'soda-peanut-grapes', 'soda-russian'
    ]
  };

  var getOriginalElement = function (arr, data) {
    var element = window.util.getRandomElement(data);
    while (arr) {
      if (!~arr.indexOf(element)) {
        arr.push(element);
        break;
      }
      element = window.util.getRandomElement(data);
    }
    return element;
  };

  var getCompositionList = function (amountComposition) {
    var composition = [];
    for (var i = 0; i < amountComposition; i++) {
      composition.push(getOriginalElement(ingredients, GoodFeature.NutritionFacts.CONTENTS));
    }
    return composition.join(', ') + '.';
  };

  var generateCards = function (amountCards) {
    var cards = [];
    for (var i = 0; i < amountCards; i++) {
      cards.push({
        amount: window.util.getRandomValue(0, 20),
        name: getOriginalElement(names, GoodFeature.NAME),
        nutritionFacts: {
          sugar: window.util.getRandomElement(GoodFeature.NutritionFacts.SUGAR),
          energy: window.util.getRandomValue(70, 500),
          contents: getCompositionList(window.util.getRandomValue(5, 7))
        },
        picture: getOriginalElement(pictures, GoodFeature.PICTURE),
        price: window.util.getRandomValue(100, 1500),
        rating: {
          number: window.util.getRandomValue(10, 900),
          value: window.util.getRandomValue(1, 5)
        },
        weight: window.util.getRandomValue(30, 300)
      });
      // очистил массив
      ingredients = [];
    }
    // очистил массив
    pictures = [];
    names = [];

    return cards;
  };

  window.catalogCards = generateCards(CATALOG_CARD_AMOUNT);
})();
