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

var changeBlockFields = function (element, attribute, boolean) {
  var inputs = element.querySelectorAll('input');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i][attribute] = boolean;
  }
};

// пришел к такому решению...
var changeFields = function (target) {
  var selector = {
    'payment__cash-wrap': 'payment__card-wrap',
    'payment__card-wrap': 'payment__cash-wrap',
    'deliver__store': 'deliver__courier',
    'deliver__courier': 'deliver__store'
  };

  for (var key in selector) {
    if (~key.indexOf(target.htmlFor)) {
      document.querySelector('#' + target.htmlFor).checked = true;
      document.querySelector('.' + selector[key]).classList.add('visually-hidden');
      document.querySelector('.' + key).classList.remove('visually-hidden');
    }
  }
};

var changeFeatureForGood = function (target, className) {
  target.classList.toggle(className);
};

var changeGoodAmount = function (target, currentTarget, value) {
  while (target.tagName !== currentTarget) {
    if (target.tagName === 'ARTICLE') {
      changeValueFields(target, value);
      if (parseFloat(target.querySelector('.card-order__count').value) <= 0) {
        target.remove();
      }
      return;
    }
    target = target.parentNode;
  }
};

var changeTextForBasket = function (isEmpty) {
  if (!isEmpty) {
    changeBlockFields(document.querySelector('.order'), 'disabled', true);
    changeBlockFields(document.querySelector('.order'), 'required', false);
    goodsCardEmptyElement.classList.remove('visually-hidden');
    goodsTotalElement.classList.add('visually-hidden');
    return true;
  } else {
    changeBlockFields(document.querySelector('.order'), 'disabled', false);
    goodsCardEmptyElement.classList.add('visually-hidden');
    goodsTotalElement.classList.remove('visually-hidden');
    return false;
  }
};

var changeValueFields = function (target, value) {
  var cardOrderCount = target.querySelector('.card-order__count');
  var cardOrderPrice = target.querySelector('.card-order__price');

  cardOrderCount.value = parseFloat(cardOrderCount.value) + value;
  goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) + value * parseFloat(cardOrderPrice.textContent) + ' ₽';
};

var checkIsClickFeature = function (target, className) {
  return target.classList.contains(className);
};

// содержится ли хоть один товар в корзине
var checkIsEmptyBasket = function (element) {
  return element.contains(element.querySelector('article'));
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

var findParentElement = function (target, currentEvt) {
  while (target.tagName !== currentEvt) {
    if (target.tagName === 'ARTICLE') {
      break;
    }
    target = target.parentNode;
  }
  return target;
};

var getGoodsAmount = function (element) {
  var goodsAmount = 0;
  for (var j = 0; j < element.length; j++) {
    goodsAmount++;
  }
  return goodsAmount;
};

var getGoodsAmountInBasket = function (goods) {
  return goods.length;
};

// не совсем совершенен способ получения окончания (от 11 - 19 не работает при таком способе)
var getRightString = function (element) {
  element = element.length.toString();
  var string = '';
  switch (element[element.length - 1]) {
    case '1':
      string = 'товар';
      break;
    case '2':
    case '3':
    case '4':
      string = 'товара';
      break;
    default:
      string = 'товаров';
      break;
  }
  return string;
};

var getSumElement = function (target, currentTarget) {
  return parseFloat(findParentElement(target, currentTarget).querySelector('.card__price').firstChild.data);
};

var sortByBigToSmallPrice = function (a, b) {
  return b.expensive - a.expensive;
};

var sortByPopular = function (a, b) {
  return a.elem.dataset.id - b.elem.dataset.id;
};

var sortByRating = function (a, b) {
  return b.rating - a.rating;
};

var sortBySmallToBigPrice = function (a, b) {
  return a.cheep - b.cheep;
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

var setGoodsAmountInBasket = function (target, currentTarget) {
  var goodCardsElements = goodCardsElement.querySelectorAll('article');
  for (var i = 0; i < goodCardsElements.length; i++) {
    if (goodCardsElements && currentTarget.dataset.id === goodCardsElements[i].dataset.cardId) {
      goodCardsElements[i].querySelector('.card-order__count').value = parseFloat(goodCardsElements[i].querySelector('.card-order__count').value) + 1;
      return false;
    }
  }
  return true;
};

var setRequaredForInputs = function (elements, boolean) {
  for (var j = 0; j < elements.length; j++) {
    elements[j].required = boolean;
  }
};

var setTotalSumItems = function (elem) {
  return parseFloat(elem.querySelector('.card-order__price').textContent) * elem.querySelector('.card-order__count').value;
};

var setTotalGoodsAmount = function (element) {
  var goodsAmount = getGoodsAmount(element);
  var stringRight = getRightString(element);
  document.querySelector('.goods__total-count').firstChild.data = 'Итого за ' + goodsAmount + ' ' + stringRight + ':';
  document.querySelector('.main-header__basket').textContent = 'В корзине ' + goodsAmount + ' ' + stringRight;
};

// изначально корзина пуста, значит все поля блокируем
changeBlockFields(document.querySelector('.order'), 'disabled', true);

for (var i = 0; i < catalogCardElements.length; i++) {
  catalogCardElements[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var currentTarget = evt.currentTarget;

    if (checkIsClickFeature(target, 'card__btn-favorite')) {
      changeFeatureForGood(target, 'card__btn-favorite--selected', 'card__btn-favorite');
    }
    if (checkIsClickFeature(target, 'card__btn-composition')) {
      changeFeatureForGood(currentTarget.querySelector('.card__composition'), 'card__composition--hidden', 'card__btn-composition');
    }

    if (!target.classList.contains('card__btn')) {
      return;
    }

    var goodCard = {
      img: currentTarget.querySelector('.card__img').src,
      price: currentTarget.querySelector('.card__price').firstChild.data,
      name: currentTarget.querySelector('.card__title').textContent,
      id: currentTarget.dataset.id
    };

    if (setGoodsAmountInBasket(target, currentTarget)) {
      goodCardsElement.appendChild(renderGoodCard(goodCard));
      // в параметрах не использую переменную потому что на момент, когда товар добавляю в корзину его еще нет.
      // А поиск коллекции прямо в параметре дает правильный результат
      document.querySelector('.goods__total-count').firstChild.data = 'Итого за ' + getGoodsAmountInBasket(goodCardsElement.querySelectorAll('article')) + ' ' + getRightString(goodCardsElement.querySelectorAll('article')) + ':';
    }

    if (!changeTextForBasket(checkIsEmptyBasket(goodCardsElement))) {
      document.querySelector('.goods__price').textContent = parseFloat(document.querySelector('.goods__price').textContent) + getSumElement(target, currentTarget) + ' ₽';
      document.querySelector('.main-header__basket').textContent = 'В корзине ' + getGoodsAmountInBasket(goodCardsElement.querySelectorAll('article')) + ' ' + getRightString(goodCardsElement.querySelectorAll('article'));
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
    goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) - setTotalSumItems(parentTarget) + ' ₽';
    setTotalGoodsAmount(goodCardsElement.querySelectorAll('article'));
  }

  if (target.tagName === 'BUTTON' && checkIsClickFeature(target, 'card-order__btn--increase')) {
    changeGoodAmount(target, currentTarget, 1);
  } else if (target.tagName === 'BUTTON' && checkIsClickFeature(target, 'card-order__btn--decrease')) {
    changeGoodAmount(target, currentTarget, -1);
  }

  if (!changeTextForBasket(checkIsEmptyBasket(goodCardsElement))) {
    setTotalGoodsAmount(goodCardsElement.querySelectorAll('article'));
  } else {
    document.querySelector('.main-header__basket').textContent = 'В корзине ничего нет';
  }
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
var rangePriceMax = document.querySelector('.range__price--max');
var rangePriceMin = document.querySelector('.range__price--min');


var getCoordsElement = function (element) {
  var box = element.getBoundingClientRect();
  return {
    coordXLeft: box.left + window.pageXOffset,
    coordXRight: box.right + window.pageXOffset,
    width: box.width
  };
};

var setFeatureForInputs = function (target) {
  var paymentInputs = document.querySelectorAll('.payment__inputs input');
  var deliverAddress = document.querySelectorAll('.deliver__address-entry-fields input');

  var fieldLabels = {
    'payment__card': [paymentInputs, true],
    'payment__cash': [paymentInputs, false],
    'deliver__courier': [deliverAddress, true],
    'deliver__store': [deliverAddress, false]
  };

  for (var key in fieldLabels) {
    if (target.htmlFor === key && checkIsEmptyBasket(goodCardsElement)) {
      setRequaredForInputs(fieldLabels[key][0], fieldLabels[key][1]);
    }
  }
};

rangeFilterElement.insertBefore(rangeFillLineElement, rangeFilterElement.firstChild);

rangeFilterElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoord = {
    x: evt.clientX
  };

  var shiftBtn = {};

  var onButtonMousemove = function (evtMousemove) {
    var coordsRangeBtnLeftElement = getCoordsElement(rangeBtnLeftElement);
    var coordsRangeBtnRightElement = getCoordsElement(rangeBtnRightElement);
    var coordsRangeFilterElement = getCoordsElement(rangeFilterElement);

    // найдем изначальный сдвиг курсора для пинов
    shiftBtn.left = startCoord.x - coordsRangeBtnLeftElement.coordXLeft;
    shiftBtn.right = startCoord.x - coordsRangeBtnRightElement.coordXLeft;

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
      rangePriceMin.textContent = Math.floor(newCoordsBtn.left);
    }

    if (checkIsClickFeature(evt.target, 'range__btn--right')) {
      rangeBtnRightElement.style.left = newCoordsBtn.right + 'px';
      rangeFillLineElement.style.right = coordsRangeFilterElement.width - coordsRangeBtnRightElement.width - newCoordsBtn.right + 'px';
      rangePriceMax.textContent = Math.floor(newCoordsBtn.right);
    }
  };

  var onButtonMouseup = function (evtMouseup) {
    var coordsRangeBtnLeftElement = getCoordsElement(rangeBtnLeftElement);
    var coordsRangeBtnRightElement = getCoordsElement(rangeBtnRightElement);
    var coordsRangeFilterElement = getCoordsElement(rangeFilterElement);

    var newCoordsBtn = {
      left: coordsRangeBtnLeftElement.coordXLeft - coordsRangeFilterElement.coordXLeft,
      right: coordsRangeBtnRightElement.coordXLeft - coordsRangeFilterElement.coordXLeft
    };

    var MIN_VALUE = 0;

    // shiftBtn.left < 0 - использую, чтобы при перемещении правого пина левее левого, левый получил нужные координаты
    // и передвинулся на новое положение, и наоборот
    shiftBtn.left = isNaN(shiftBtn.left) || shiftBtn.left < MIN_VALUE ? MIN_VALUE : shiftBtn.left;
    shiftBtn.right = isNaN(shiftBtn.right) || shiftBtn.right > coordsRangeBtnRightElement.width ? MIN_VALUE : shiftBtn.right;

    if (evtMouseup.clientX < (coordsRangeBtnRightElement.coordXLeft + coordsRangeBtnLeftElement.coordXLeft) / 2) {
      newCoordsBtn.left = evtMouseup.clientX - coordsRangeFilterElement.coordXLeft - shiftBtn.left;
      if (newCoordsBtn.left <= 0) {
        newCoordsBtn.left = 0;
      }
      rangeBtnLeftElement.style.left = newCoordsBtn.left + 'px';
      rangeFillLineElement.style.left = newCoordsBtn.left + 'px';
      rangePriceMin.textContent = Math.floor(newCoordsBtn.left);
    } else {
      newCoordsBtn.right = evtMouseup.clientX - coordsRangeFilterElement.coordXLeft - shiftBtn.right;
      if (newCoordsBtn.right >= coordsRangeFilterElement.width - coordsRangeBtnRightElement.width) {
        newCoordsBtn.right = coordsRangeFilterElement.width - coordsRangeBtnRightElement.width;
      }
      rangeBtnRightElement.style.left = newCoordsBtn.right + 'px';
      rangeFillLineElement.style.right = coordsRangeFilterElement.width - coordsRangeBtnRightElement.width - newCoordsBtn.right + 'px';
      rangePriceMax.textContent = Math.floor(newCoordsBtn.right);
    }
    document.removeEventListener('mousemove', onButtonMousemove);
    document.removeEventListener('mouseup', onButtonMouseup);
  };

  document.addEventListener('mousemove', onButtonMousemove);
  document.addEventListener('mouseup', onButtonMouseup);
});

document.querySelector('.deliver__store-list').addEventListener('click', function (evt) {
  evt.preventDefault();
  var target = evt.target;
  var currentTarget = evt.currentTarget;

  if (target.tagName !== 'LABEL') {
    return;
  }

  document.querySelector('.deliver__store-map-img').src = 'img/map/' + currentTarget.querySelector('#' + target.htmlFor).value + '.jpg';
  currentTarget.querySelector('#' + target.htmlFor).checked = true;
});

document.querySelector('.buy').addEventListener('click', function (evt) {
  var target = evt.target;

  changeFields(target);
  setFeatureForInputs(target);
});


