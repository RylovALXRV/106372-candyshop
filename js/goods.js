'use strict';

var catalogCardTemplate = document.querySelector('#card').content.querySelector('.card');
var goodCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var goodCardsElem = document.querySelector('.goods__cards');

var ingredients = [];
var pictures = [];

var CATALOG_CARD_AMOUNT = 26;
var GOOD_CARD_AMOUNT = 3;

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

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomValue = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getOriginalElement = function (arr, data) {
  var element = getRandomElement(data);
  while (arr) {
    if (!~arr.indexOf(element)) {
      arr.push(element);
      break;
    }
    element = getRandomElement(data);
  }
  return element;
};

var getCompositionList = function (amountComposition) {
  var composition = '';
  for (var i = 0; i < amountComposition - 1; i++) {
    if (composition.length === 0) {
      composition += getOriginalElement(ingredients, GoodFeature.NutritionFacts.CONTENTS);
    } else {
      composition += ', ' + getOriginalElement(ingredients, GoodFeature.NutritionFacts.CONTENTS);
    }
  }
  return composition + '.';
};

var generateCards = function (amountCards) {
  var cards = [];
  for (var i = 0; i < amountCards; i++) {
    cards.push({
      amount: getRandomValue(0, 20),
      name: getRandomElement(GoodFeature.NAME),
      nutritionFacts: {
        sugar: getRandomElement(GoodFeature.NutritionFacts.SUGAR),
        energy: getRandomValue(70, 500),
        contents: getCompositionList(getRandomValue(5, 7))
      },
      picture: getOriginalElement(pictures, GoodFeature.PICTURE),
      price: getRandomValue(100, 1500),
      rating: {
        number: getRandomValue(10, 900),
        value: getRandomValue(1, 5)
      },
      weight: getRandomValue(30, 300)
    });
    // очистил массив
    ingredients = [];
  }
  // очистил массив
  pictures = [];

  return cards;
};

var setClassAccordingToRating = function (rating, elem) {
  switch (rating) {
    case 1:
      elem.classList.add('stars__rating--one');
      return;
    case 2:
      elem.classList.add('stars__rating--two');
      return;
    case 3:
      elem.classList.add('stars__rating--three');
      return;
    case 4:
      elem.classList.add('stars__rating--four');
      return;
    case 5:
      elem.classList.add('stars__rating--five');
      return;
  }
};

var setClassAccordingToAmount = function (amount, elem) {
  if (amount > 5) {
    elem.classList.add('card--in-stock');
  } else if (amount >= 1) {
    elem.classList.add('card--little');
  } else {
    elem.classList.add('card--soon');
  }
};

var setClassAccordingToIsSugar = function (isSugar, elem) {
  if (isSugar) {
    elem.querySelector('.card__characteristic').textContent = 'Содержит сахар';
  } else {
    elem.querySelector('.card__characteristic').textContent = 'Без сахара';
  }
};

var renderCatalogCard = function (card) {
  var element = catalogCardTemplate.cloneNode(true);
  element.querySelector('.card__img').src = 'img/cards/' + card.picture + '.jpg';
  element.querySelector('.card__composition-list').textContent = card.nutritionFacts.contents;
  element.querySelector('.card__price').firstChild.data = card.price + ' ';
  element.querySelector('.card__title').textContent = card.name;
  element.querySelector('.card__weight').textContent = '/ ' + card.weight + ' Г';
  element.querySelector('.star__count').textContent = card.rating.number;
  setClassAccordingToAmount(card.amount, element);
  setClassAccordingToIsSugar(card.nutritionFacts.sugar, element);
  setClassAccordingToRating(card.rating.value, element.querySelector('.stars__rating'));
  return element;
};

var renderGoodCard = function (goodCard) {
  var element = goodCardTemplate.cloneNode(true);
  element.querySelector('.card-order__img').src = 'img/cards/' + goodCard.picture + '.jpg';
  element.querySelector('.card-order__price').textContent = goodCard.price + ' ₽';
  element.querySelector('.card-order__title').textContent = goodCard.name;
  element.querySelector('.visually-hidden').textContent = goodCard.amount;
  return element;
};

var appendCatalogCards = function (cards) {
  var fragmentCatalogCards = document.createDocumentFragment();
  cards.forEach(function (card) {
    fragmentCatalogCards.appendChild(renderCatalogCard(card));
  });
  document.querySelector('.catalog__cards').appendChild(fragmentCatalogCards);
};

var appendGoodCards = function (cards) {
  var fragmentGoodCards = document.createDocumentFragment();
  cards.forEach(function (card) {
    fragmentGoodCards.appendChild(renderGoodCard(card));
  });
  goodCardsElem.appendChild(fragmentGoodCards);
};


var catalogCards = generateCards(CATALOG_CARD_AMOUNT);
var goodCards = generateCards(GOOD_CARD_AMOUNT);

appendCatalogCards(catalogCards);
appendGoodCards(goodCards);

goodCardsElem.classList.remove('goods__cards--empty');
document.querySelector('.goods__card-empty').classList.add('visually-hidden');
document.querySelector('.catalog__cards').classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');
