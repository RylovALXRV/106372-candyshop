'use strict';

(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var catalogCardsWrap = document.querySelector('.catalog__cards-wrap');
  var catalogEmptyFilterElement = document.querySelector('.catalog__empty-filter');
  var catalogFilter = document.querySelectorAll('.catalog__filter');
  var rangeFillLineElement = document.querySelector('.range__fill-line');
  var rangeFilterElement = document.querySelector('.range__filter');
  var rangePriceMax = document.querySelector('.range__price--max');
  var rangePriceMin = document.querySelector('.range__price--min');

  var cardFilter = [];

  var setRangeCountField = function (goods, cards) {
    var rangeFilterWidth = document.querySelector('.range__filter').offsetWidth;
    document.querySelector('.range__btn--left').style.left = 0;
    document.querySelector('.range__btn--right').style.left = rangeFilterWidth - 10 + 'px';
    document.querySelector('span.range__count').textContent = '(' + goods.length + ')';
    rangeFillLineElement.style.left = '0';
    rangeFillLineElement.style.right = '0';
    rangePriceMin.textContent = '0';
    rangePriceMax.textContent = window.range.getMaxPrice(cards);
  };

  var goodAmount = {
    'icecream': 0,
    'soda': 0,
    'gum': 0,
    'marmalade': 0,
    'marshmallows': 0,
    'sugar-free': 0,
    'vegetarian': 0,
    'gluten-free': 0,
    'favorite': 0,
    'availability': 0
  };

  var foodType = {
    'icecream': 'Мороженое',
    'soda': 'Газировка',
    'gum': 'Жевательная резинка',
    'marmalade': 'Мармелад',
    'marshmallows': 'Зефир',
    'sugar-free': ['sugar', false],
    'vegetarian': ['vegetarian', true],
    'gluten-free': ['gluten', false],
    'availability': 0
  };

  var getAmountTypeGood = function (goods, type, amountGood) {
    goods.forEach(function (good) {
      for (var value in type) {
        if (good.kind === type[value]) {
          amountGood[value]++;
        } else if (good.nutritionFacts[type[value][0]] === type[value][1]) {
          amountGood[value]++;
        } else if (good.amount !== type[value] && type[value] === 'availability') {
          amountGood[value]++;
        }
      }
    });
  };

  var appendItemCount = function (goods, type, amountGood) {
    getAmountTypeGood(goods, type, amountGood);
    var amount = 0;
    var inputs = document.querySelectorAll('.catalog__filter input');

    for (var i = 0; i < inputs.length; i++) {
      var parentElement = window.util.findParentElement(inputs[i], document, 'LI');
      for (var typeGood in goodAmount) {
        if (inputs[i].value === typeGood) {
          amount = goodAmount[typeGood];
        }
      }
      if (parentElement.querySelector('.input-btn__item-count')) {
        parentElement.querySelector('.input-btn__item-count').textContent = '(' + amount + ')';
      }
    }
  };

  setTimeout(function () {
    appendItemCount(window.catalog.cards(), foodType, goodAmount);
  }, 1500);

  var getInput = function (field, i) {
    return field[i] ? field[i] : false;
  };

  var filterByKind = function (card, target, typeFood) {
    if (target[0] === undefined) {
      return true;
    }
    return card['kind'] === typeFood[getInput(target, 0).value] ||
      card['kind'] === typeFood[getInput(target, 1).value] ||
      card['kind'] === typeFood[getInput(target, 2).value] ||
      card['kind'] === typeFood[getInput(target, 3).value] ||
      card['kind'] === typeFood[getInput(target, 4).value];
  };

  var filterByOneNutritionFacts = function (card, target, foodProperty) {
    if (target[0] === undefined) {
      return true;
    }
    return card['nutritionFacts'][foodProperty[getInput(target, 0).value][0]] === foodProperty[getInput(target, 0).value][1];
  };

  var filterByTwoNutritionFacts = function (card, target, foodProperty) {
    if (target[1] === undefined && target[2] === undefined) {
      return true;
    }
    return card['nutritionFacts'][foodProperty[getInput(target, 0).value][0]] === foodProperty[getInput(target, 0).value][1] &&
      card['nutritionFacts'][foodProperty[getInput(target, 1).value][0]] === foodProperty[getInput(target, 1).value][1];
  };

  var filterByThreeNutritionFacts = function (card, target, foodProperty) {
    if (target[1] === undefined || target[2] === undefined) {
      return true;
    }
    return card['nutritionFacts'][foodProperty[getInput(target, 0).value][0]] === foodProperty[getInput(target, 0).value][1] &&
      card['nutritionFacts'][foodProperty[getInput(target, 1).value][0]] === foodProperty[getInput(target, 1).value][1] &&
      card['nutritionFacts'][foodProperty[getInput(target, 2).value][0]] === foodProperty[getInput(target, 2).value][1];
  };

  var showCurrentCards = function (elements, cards) {
    window.util.changeAttributeFields(document.querySelector('.catalog__sidebar'), 'checked', false);
    for (var k = 0; k < elements.length; k++) {
      catalogCardsElement.removeChild(elements[k]);
    }
    window.catalog.appendCards(cards);
  };

  var appendCards = function (filter, cards) {
    catalogCardsWrap.removeChild(catalogCardsElement);

    for (var i = 0; i < cards.length; i++) {
      catalogCardsElement.removeChild(cards[i]);
    }
    window.catalog.appendCards(filter);
    catalogCardsWrap.appendChild(catalogCardsElement);
  };

  catalogFilter[0].addEventListener('click', function (evt) {
    var inputFoodType = catalogFilter[0].querySelectorAll('input:checked');
    var target = evt.target;

    if (target.tagName !== 'INPUT') {
      return;
    }

    cardFilter = window.catalog.cards();

    var fieldFilter = cardFilter.filter(function (card) {
      return filterByKind(card, inputFoodType, foodType);
    });

    cardFilter = fieldFilter;
    appendCards(cardFilter, catalogCardsElement.querySelectorAll('article'));
  });

  catalogFilter[1].addEventListener('click', function (evt) {
    var inputFoodProperty = catalogFilter[1].querySelectorAll('input:checked');
    var target = evt.target;

    if (target.tagName !== 'INPUT') {
      return;
    }

    cardFilter = window.catalog.cards();

    var fieldFilter = cardFilter.filter(function (card) {
      return filterByOneNutritionFacts(card, inputFoodProperty, foodType);
    }).filter(function (card) {
      return filterByTwoNutritionFacts(card, inputFoodProperty, foodType);
    }).filter(function (card) {
      return filterByThreeNutritionFacts(card, inputFoodProperty, foodType);
    });

    cardFilter = fieldFilter;
    appendCards(cardFilter, catalogCardsElement.querySelectorAll('article'));
  });

  catalogFilter[2].addEventListener('mouseup', function (evt) {
    var target = evt.target;
    var buttonRange = target.closest('.range__btn');

    if (!buttonRange) {
      return;
    }

    cardFilter = window.catalog.cards();

    var filterRangeCount = cardFilter.filter(function (card) {
      return card.price >= document.querySelector('.range__price--min').textContent && card.price <= document.querySelector('.range__price--max').textContent;
    });

    cardFilter = filterRangeCount;
    appendCards(cardFilter, catalogCardsElement.querySelectorAll('article'));

    document.querySelector('span.range__count').textContent = '(' + catalogCardsElement.querySelectorAll('article').length + ')';
  });

  var chooseFavoriteCard = function () {
    var cards = catalogCardsElement.querySelectorAll('article');
    var favoriteCard = [];
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i].querySelector('.card__btn-favorite');
      if (card.classList.contains('card__btn-favorite--selected')) {
        favoriteCard.push(cards[i].querySelector('.card__title').textContent);
      }
    }
    return favoriteCard;
  };

  catalogFilter[3].addEventListener('click', function (evt) {
    var target = evt.target;
    var favoriteCard = chooseFavoriteCard();

    if (target.tagName !== 'INPUT') {
      return;
    }

    cardFilter = window.catalog.cards();

    if (target.value === 'favorite' && target.checked) {
      var filterFavorite = cardFilter.filter(function (card) {
        return favoriteCard.indexOf(card.name);
      });
      cardFilter = filterFavorite;
    }
    if (target.value === 'availability' && target.checked) {
      var filterAvailibility = cardFilter.filter(function (card) {
        return card.amoumt !== 0;
      });
    }
    cardFilter = filterFavorite || filterAvailibility;
    appendCards(cardFilter, catalogCardsElement.querySelectorAll('article'));
  });

  catalogFilter[4].addEventListener('click', function (evt) {
    var target = evt.target;
    var catalogCardsElements = catalogCardsElement.querySelectorAll('article');
    var articles = [];

    if (target.tagName !== 'INPUT') {
      return;
    }

    for (var j = 0; j < catalogCardsElements.length; j++) {
      articles.push({
        elem: catalogCardsElements[j],
        rating: catalogCardsElements[j].querySelector('.star__count').textContent,
        price: catalogCardsElements[j].querySelector('.card__price').firstChild.data
      });
    }

    window.sort.sortFeature(target.value, articles);

    for (var i = 0; i < articles.length; i++) {
      catalogCardsElement.appendChild(articles[i].elem);
    }
  });

  document.querySelector('.catalog__submit').addEventListener('click', function (evt) {
    evt.preventDefault();
    showCurrentCards(catalogCardsElement.querySelectorAll('article'), window.catalog.cards());
    setRangeCountField(catalogCardsElement.querySelectorAll('article'), window.catalog.cards());
    catalogEmptyFilterElement.classList.add('visually-hidden');
  });

  rangeFilterElement.insertBefore(rangeFillLineElement, rangeFilterElement.firstChild);

  window.filter = {
    appendItemCount: appendItemCount,
    setRangeCountField: setRangeCountField
  };
})();
