'use strict';

var catalogCardTemplate = document.querySelector('#card').content.querySelector('.card');
var goodCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
var goodCardsElement = document.querySelector('.goods__cards');
var catalogCardsElement = document.querySelector('.catalog__cards');

var dataId = 1;

var ingredients = [];
var pictures = [];
var names = [];

var CATALOG_CARD_AMOUNT = 26;
// var GOOD_CARD_AMOUNT = 3;

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
      amount: getRandomValue(0, 20),
      name: getOriginalElement(names, GoodFeature.NAME),
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
  names = [];

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
  element.dataset.id = dataId++;
  setClassAccordingToAmount(card.amount, element);
  setClassAccordingToIsSugar(card.nutritionFacts.sugar, element);
  setClassAccordingToRating(card.rating.value, element.querySelector('.stars__rating'));
  return element;
};

var renderGoodCard = function (goodCard) {
  var element = goodCardTemplate.cloneNode(true);
  element.querySelector('.card-order__img').src = goodCard.img;
  element.querySelector('.card-order__price').textContent = goodCard.price + ' ₽';
  element.querySelector('.card-order__title').textContent = goodCard.name;
  element.querySelector('.visually-hidden').textContent = goodCard.amount;
  element.querySelector('.visually-hidden').textContent = 1;
  element.querySelector('.card-order__count').value = element.querySelector('.visually-hidden').textContent;
  element.dataset.cardId = goodCard.id;
  return element;
};

var appendCatalogCards = function (cards) {
  var fragmentCatalogCards = document.createDocumentFragment();
  cards.forEach(function (card) {
    fragmentCatalogCards.appendChild(renderCatalogCard(card));
  });
  catalogCardsElement.appendChild(fragmentCatalogCards);
};

// var appendGoodCards = function (cards) {
//   var fragmentGoodCards = document.createDocumentFragment();
//   cards.forEach(function (card) {
//     fragmentGoodCards.appendChild(renderGoodCard(card));
//   });
//   goodCardsElement.appendChild(fragmentGoodCards);
// };

var catalogCards = generateCards(CATALOG_CARD_AMOUNT);
// var goodCards = generateCards(GOOD_CARD_AMOUNT);

appendCatalogCards(catalogCards);
// appendGoodCards(goodCards);

goodCardsElement.classList.remove('goods__cards--empty');
// document.querySelector('.goods__card-empty').classList.add('visually-hidden');
catalogCardsElement.classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');

// --------------- #16 Личный проект: подробности ---------------------

var catalogCardElements = document.querySelectorAll('.catalog__card');
var catalogCardsWrap = document.querySelector('.catalog__cards-wrap');
var goodsCardEmptyElement = document.querySelector('.goods__card-empty');

// содержится ли хоть один товар в корзине
var checkIsEmptyBasket = function (elem) {
  return elem.contains(elem.querySelector('article'));
};

var addOrRemoveTextForBasket = function (isEmpty, elem) {
  if (!isEmpty) {
    elem.classList.remove('visually-hidden');
  } else {
    elem.classList.add('visually-hidden');
  }
};

var checkIsClickFeature = function (evt, cls) {
  return evt.classList.contains(cls);
};

var addOrRemoveFeatureForGood = function (isFeature, evt, cls) {
  if (isFeature) {
    evt.classList.toggle(cls);
  }
};

var changeSignForInputValue = function (evt, sign) {
  switch (sign) {
    case '+':
      evt.querySelector('.card-order__count').value = parseFloat(evt.querySelector('.card-order__count').value) + 1;
      return;
    case '-':
      evt.querySelector('.card-order__count').value = parseFloat(evt.querySelector('.card-order__count').value) - 1;
      return;
  }
};

var changeAmountGood = function (evt, currentEvt, sign) {
  while (evt.tagName !== currentEvt) {
    if (evt.tagName === 'ARTICLE') {
      changeSignForInputValue(evt, sign);
      if (parseFloat(evt.querySelector('.card-order__count').value) <= 0) {
        evt.remove();
      }
      return;
    }
    evt = evt.parentNode;
  }
};

var sortByRating = function (a, b) {
  return a.rating - b.rating;
};

var sortByBigToSmallPrice = function (a, b) {
  return b.expensive - a.expensive;
};

var sortBySmallToBigPrice = function (a, b) {
  return a.cheep - b.cheep;
};

var sortByFeature = function (arr, evt) {
  switch (evt) {
    case 'rating':
      arr.sort(sortByRating);
      return;
    case 'cheep':
      arr.sort(sortBySmallToBigPrice);
      return;
    case 'expensive':
      arr.sort(sortByBigToSmallPrice);
      return;
  }
};

for (var i = 0; i < catalogCardElements.length; i++) {
  catalogCardElements[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var currentTarget = evt.currentTarget;
    var goodCardsElements = goodCardsElement.querySelectorAll('article');

    addOrRemoveFeatureForGood(checkIsClickFeature(target, 'card__btn-favorite'), target, 'card__btn-favorite--selected');
    addOrRemoveFeatureForGood(checkIsClickFeature(target, 'card__btn-composition'), currentTarget.querySelector('.card__composition'), 'card__composition--hidden');

    if (!target.classList.contains('card__btn')) {
      return;
    }

    var goodCard = {
      img: currentTarget.querySelector('.card__img').src,
      price: currentTarget.querySelector('.card__price').firstChild.data,
      name: currentTarget.querySelector('.card__title').textContent,
      id: currentTarget.dataset.id
    };

    for (var j = 0; j < goodCardsElements.length; j++) {
      if (goodCardsElements && currentTarget.dataset.id === goodCardsElements[j].dataset.cardId) {
        goodCardsElements[j].querySelector('.card-order__count').value = parseFloat(goodCardsElements[j].querySelector('.card-order__count').value) + 1;
        return;
      }
    }

    goodCardsElement.appendChild(renderGoodCard(goodCard));

    addOrRemoveTextForBasket(checkIsEmptyBasket(goodCardsElement), goodsCardEmptyElement);
  });
}

goodCardsElement.addEventListener('click', function (evt) {
  evt.preventDefault();
  var target = evt.target;
  var currentTarget = evt.currentTarget;

  if (target.tagName === 'A' && target.classList.contains('card-order__close')) {
    target.parentNode.remove();
  }

  if (target.tagName === 'BUTTON' && checkIsClickFeature(target, 'card-order__btn--increase')) {
    changeAmountGood(target, currentTarget, '+');
  } else if (target.tagName === 'BUTTON' && checkIsClickFeature(target, 'card-order__btn--decrease')) {
    changeAmountGood(target, currentTarget, '-');
  }

  addOrRemoveTextForBasket(checkIsEmptyBasket(goodCardsElement), goodsCardEmptyElement);
});

document.querySelector('.catalog__sidebar').addEventListener('click', function (evt) {
  var target = evt.target;
  var catalogCardsElements = catalogCardsElement.querySelectorAll('article');
  if (target.tagName !== 'INPUT') {
    return;
  }

  var articles = [];

  for (var j = 0; j < catalogCardsElements.length; j++) {
    articles.push({
      elem: catalogCardsElements[j],
      rating: catalogCardsElements[j].querySelector('.star__count').textContent,
      expensive: catalogCardsElements[j].querySelector('.card__price').firstChild.data,
      cheep: catalogCardsElements[j].querySelector('.card__price').firstChild.data
    });
  }

  sortByFeature(articles, target.value);

  catalogCardsWrap.removeChild(catalogCardsElement);

  for (var k = 0; k < articles.length; k++) {
    catalogCardsElement.appendChild(articles[k].elem);
  }

  catalogCardsWrap.insertBefore(catalogCardsElement, catalogCardsWrap.firstChild);
});
