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

var setClassAccordingToRating = function (rating, element) {
  switch (rating) {
    case 1:
      element.classList.add('stars__rating--one');
      return;
    case 2:
      element.classList.add('stars__rating--two');
      return;
    case 3:
      element.classList.add('stars__rating--three');
      return;
    case 4:
      element.classList.add('stars__rating--four');
      return;
    case 5:
      element.classList.add('stars__rating--five');
      return;
  }
};

var setClassAccordingToAmount = function (amount, element) {
  if (amount > 5) {
    element.classList.add('card--in-stock');
  } else if (amount >= 1) {
    element.classList.add('card--little');
  } else {
    element.classList.add('card--soon');
  }
};

var setClassAccordingToIsSugar = function (isSugar, element) {
  if (isSugar) {
    element.querySelector('.card__characteristic').textContent = 'Содержит сахар';
  } else {
    element.querySelector('.card__characteristic').textContent = 'Без сахара';
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

var catalogCards = generateCards(CATALOG_CARD_AMOUNT);

appendCatalogCards(catalogCards);

goodCardsElement.classList.remove('goods__cards--empty');
catalogCardsElement.classList.remove('catalog__cards--load');
document.querySelector('.catalog__load').classList.add('visually-hidden');

// --------------- #16 Личный проект: подробности ---------------------

var catalogCardElements = document.querySelectorAll('.catalog__card');
var catalogCardsWrap = document.querySelector('.catalog__cards-wrap');
var goodsCardEmptyElement = document.querySelector('.goods__card-empty');
var goodsPriceElement = document.querySelector('.goods__price');
var goodsTotalElement = document.querySelector('.goods__total');

// содержится ли хоть один товар в корзине
var checkIsEmptyBasket = function (element) {
  return element.contains(element.querySelector('article'));
};

var changeTextForBasket = function (isEmpty) {
  if (!isEmpty) {
    goodsCardEmptyElement.classList.remove('visually-hidden');
    goodsTotalElement.classList.add('visually-hidden');
  } else {
    goodsCardEmptyElement.classList.add('visually-hidden');
    goodsTotalElement.classList.remove('visually-hidden');
  }
};

var checkIsClickFeature = function (evt, className) {
  return evt.classList.contains(className);
};

var changeFeatureForGood = function (isFeature, evt, className) {
  if (isFeature) {
    evt.classList.toggle(className);
  }
};

var changeSignForInputValue = function (evt, sign) {
  var cardOrderCountEvt = evt.querySelector('.card-order__count');
  var cardOrderPriceEvt = evt.querySelector('.card-order__price');

  switch (sign) {
    case '+':
      cardOrderCountEvt.value = parseFloat(cardOrderCountEvt.value) + 1;
      goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) + parseFloat(cardOrderPriceEvt.textContent) + ' ₽';
      return;
    case '-':
      cardOrderCountEvt.value = parseFloat(cardOrderCountEvt.value) - 1;
      goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) - parseFloat(cardOrderPriceEvt.textContent) + ' ₽';
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

var findParentElement = function (evt, currentEvt) {
  while (evt.tagName !== currentEvt) {
    if (evt.tagName === 'ARTICLE') {
      break;
    }
    evt = evt.parentNode;
  }
  return evt;
};

var sortByRating = function (a, b) {
  return b.rating - a.rating;
};

var sortByBigToSmallPrice = function (a, b) {
  return b.expensive - a.expensive;
};

var sortBySmallToBigPrice = function (a, b) {
  return a.cheep - b.cheep;
};

var sortByPopular = function (a, b) {
  return a.elem.dataset.id - b.elem.dataset.id;
};

var sortByFeature = function (evt, arr) {
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
    case 'popular':
      arr.sort(sortByPopular);
  }
};

var countGoodsInBasket = function (goods) {
  return goods.length + 1;
};

var getSumElement = function (evt, currentTarget) {
  return parseFloat(findParentElement(evt, currentTarget).querySelector('.card__price').firstChild.data);
};

var getContentBasket = function (evt, currentTarget) {
  var goodCardsElements = goodCardsElement.querySelectorAll('article');
  for (var j = 0; j < goodCardsElements.length; j++) {
    if (goodCardsElements && currentTarget.dataset.id === goodCardsElements[j].dataset.cardId) {
      goodCardsElements[j].querySelector('.card-order__count').value = parseFloat(goodCardsElements[j].querySelector('.card-order__count').value) + 1;
      return false;
    }
  }
  return true;
};

var countTotalSumElement = function (elem) {
  return parseFloat(elem.querySelector('.card-order__price').textContent) * elem.querySelector('.card-order__count').value;
};

var checkIsNumeric = function (value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// в задании написано только про проверку номера, я добавил немного от себя с проверками других полей
var checkRightField = function (evt) {
  var sum = 0;

  switch (evt) {
    case (document.querySelector('#payment__card-number')):
      var targetValuesNumber = evt.value.split('');
      for (var i = 0; i < targetValuesNumber.length; i++) {
        var targetValueNumber = parseFloat(targetValuesNumber[i]);
        if (i % 2 === 0) {
          if (targetValueNumber * 2 >= 10) {
            sum += (targetValueNumber * 2) - 9;
          } else {
            sum += targetValueNumber * 2;
          }
        } else {
          sum += targetValueNumber;
        }
      }
      if (sum % 10 !== 0) {
        evt.setCustomValidity('введённый номер неверен');
      } else if (targetValuesNumber.length !== 16) {
        evt.setCustomValidity('номер карты должен состоять из 16 цифр.');
      } else {
        evt.setCustomValidity('');
        return true;
      }
      break;
    case (document.querySelector('#payment__card-date')):
      var targetValuesDate = evt.value.split('/');
      if (!targetValuesDate[0] || targetValuesDate[0].length !== 2 || !checkIsNumeric(targetValuesDate[0])) {
        evt.setCustomValidity('месяц не корректен');
      } else if (targetValuesDate[0] === '00' || targetValuesDate[0] > 12) {
        evt.setCustomValidity('месяц не корректен. Месяц должен быть в диапазоне от 01 до 12');
      } else if (!targetValuesDate[1] || targetValuesDate[1].length !== 2 || !checkIsNumeric(targetValuesDate[1])) {
        evt.setCustomValidity('год не корректен');
      } else {
        evt.setCustomValidity('');
        return true;
      }
      break;
    case (document.querySelector('#payment__card-cvc')):
      if (!checkIsNumeric(evt.value)) {
        evt.setCustomValidity('cvc не корректен. Он должен содержать только цифры');
      } else if (evt.value.length !== 3) {
        evt.setCustomValidity('cvc не корректен. Он должен содержать только 3 цифры');
      } else {
        evt.setCustomValidity('');
        return true;
      }
      break;
    case (document.querySelector('#payment__cardholder')):
      var targetCardHolder = evt.value.split(' ');
      if (!targetCardHolder[0] || !targetCardHolder[1]) {
        evt.setCustomValidity('Введены не все данные');
      } else {
        evt.setCustomValidity('');
        return true;
      }
      break;
  }
  return false;
};

for (var i = 0; i < catalogCardElements.length; i++) {
  catalogCardElements[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var currentTarget = evt.currentTarget;
    var goodCardsElements = goodCardsElement.querySelectorAll('article');

    changeFeatureForGood(checkIsClickFeature(target, 'card__btn-favorite'), target, 'card__btn-favorite--selected');
    changeFeatureForGood(checkIsClickFeature(target, 'card__btn-composition'), currentTarget.querySelector('.card__composition'), 'card__composition--hidden');

    if (!target.classList.contains('card__btn')) {
      return;
    }

    var goodCard = {
      img: currentTarget.querySelector('.card__img').src,
      price: currentTarget.querySelector('.card__price').firstChild.data,
      name: currentTarget.querySelector('.card__title').textContent,
      id: currentTarget.dataset.id
    };


    if (getContentBasket(target, currentTarget)) {
      goodCardsElement.appendChild(renderGoodCard(goodCard));
    }

    if (!changeTextForBasket(checkIsEmptyBasket(goodCardsElement))) {
      document.querySelector('.goods__total-count').firstChild.data = 'Итого за ' + countGoodsInBasket(goodCardsElements) + ' товаров';
      document.querySelector('.goods__price').textContent = parseFloat(document.querySelector('.goods__price').textContent) + getSumElement(target, currentTarget) + ' ₽';
    }
  });
}

goodCardsElement.addEventListener('click', function (evt) {
  evt.preventDefault();
  var target = evt.target;
  var currentTarget = evt.currentTarget;

  if (target.tagName === 'A' && target.classList.contains('card-order__close')) {
    target.parentNode.remove();
    var parentTarget = findParentElement(target, currentTarget);
    goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) - countTotalSumElement(parentTarget) + ' ₽';
  }

  if (target.tagName === 'BUTTON' && checkIsClickFeature(target, 'card-order__btn--increase')) {
    changeAmountGood(target, currentTarget, '+');
  } else if (target.tagName === 'BUTTON' && checkIsClickFeature(target, 'card-order__btn--decrease')) {
    changeAmountGood(target, currentTarget, '-');
  }

  changeTextForBasket(checkIsEmptyBasket(goodCardsElement));
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
      cheep: catalogCardsElements[j].querySelector('.card__price').firstChild.data,
      availability: catalogCardsElements[j].classList.contains('card--soon')
    });
  }

  sortByFeature(target.value, articles);

  catalogCardsWrap.removeChild(catalogCardsElement);

  for (var k = 0; k < articles.length; k++) {
    catalogCardsElement.appendChild(articles[k].elem);
  }

  catalogCardsWrap.insertBefore(catalogCardsElement, catalogCardsWrap.firstChild);
});

document.querySelector('.payment').addEventListener('input', function (evt) {
  var target = evt.target;

  if (target.tagName !== 'INPUT') {
    return;
  }

  if (checkRightField(target)) {
    document.querySelector('.payment__card-status').textContent = 'Одобрен';
  } else {
    document.querySelector('.payment__card-status').textContent = 'Неизвестен';
  }
});

// ---------------------- Личный проект: максимум подвижности -----------------------

var rangeBtnLeftElement = document.querySelector('.range__btn--left');
var rangeBtnRightElement = document.querySelector('.range__btn--right');
var rangeFillLineElement = document.querySelector('.range__fill-line');
var rangeFilterElement = document.querySelector('.range__filter');

var getCoordsElement = function (element) {
  var box = element.getBoundingClientRect();
  return {
    coordXLeft: box.left + window.pageXOffset,
    coordXRight: box.right + window.pageXOffset,
    width: box.width
  };
};

document.querySelector('.range__filter').addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  if (evt.target.tagName !== 'BUTTON') {
    return;
  }

  var startCoord = {
    x: evt.clientX
  };

  evt.target.style.zIndex = 9999;

  var onButtonMousemove = function (evtMousemove) {
    var coordsRangeBtnLeftElement = getCoordsElement(rangeBtnLeftElement);
    var coordsRangeBtnRightElement = getCoordsElement(rangeBtnRightElement);
    var coordsRangeFilterElement = getCoordsElement(rangeFilterElement);

    var shift = {
      x: startCoord.x - evtMousemove.clientX
    };

    startCoord = {
      x: evtMousemove.clientX
    };

    var newCoordsBtn = {
      left: coordsRangeBtnLeftElement.coordXLeft - shift.x - coordsRangeFilterElement.coordXLeft,
      right: coordsRangeBtnRightElement.coordXLeft - shift.x - coordsRangeFilterElement.coordXLeft
    };

    if (newCoordsBtn.left <= 0) {
      newCoordsBtn.left = 0;
    }

    if (newCoordsBtn.left >= coordsRangeBtnRightElement.coordXLeft - coordsRangeFilterElement.coordXLeft - coordsRangeBtnRightElement.width) {
      newCoordsBtn.left = coordsRangeBtnRightElement.coordXLeft - coordsRangeFilterElement.coordXLeft - coordsRangeBtnRightElement.width;
    }

    if (newCoordsBtn.right >= coordsRangeFilterElement.width - coordsRangeBtnRightElement.width) {
      newCoordsBtn.right = coordsRangeFilterElement.width - coordsRangeBtnRightElement.width;
    }

    if (newCoordsBtn.right <= coordsRangeBtnLeftElement.coordXLeft - coordsRangeFilterElement.coordXLeft + coordsRangeBtnRightElement.width) {
      newCoordsBtn.right = coordsRangeBtnLeftElement.coordXLeft - coordsRangeFilterElement.coordXLeft + coordsRangeBtnRightElement.width;
    }

    if (checkIsClickFeature(evt.target, 'range__btn--left')) {
      rangeBtnLeftElement.style.left = newCoordsBtn.left + 'px';
      rangeFillLineElement.style.left = newCoordsBtn.left + 'px';
    }

    if (checkIsClickFeature(evt.target, 'range__btn--right')) {
      rangeBtnRightElement.style.left = newCoordsBtn.right + 'px';
      rangeFillLineElement.style.right = coordsRangeFilterElement.width - coordsRangeBtnRightElement.width - newCoordsBtn.right + 'px';
    }
  };

  var onButtonMouseup = function () {
    document.removeEventListener('mousemove', onButtonMousemove);
    document.removeEventListener('mouseup', onButtonMouseup);
  };

  document.addEventListener('mousemove', onButtonMousemove);
  document.addEventListener('mouseup', onButtonMouseup);

});

