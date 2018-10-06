'use strict';

(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var catalogCardsWrap = document.querySelector('.catalog__cards-wrap');
  var catalogFilter = document.querySelectorAll('.catalog__filter');
  var rangeBtnLeftElement = document.querySelector('.range__btn--left');
  var rangeBtnRightElement = document.querySelector('.range__btn--right');
  var rangeFillLineElement = document.querySelector('.range__fill-line');
  var rangeFilterElement = document.querySelector('.range__filter');
  var rangePriceMax = document.querySelector('.range__price--max');
  var rangePriceMin = document.querySelector('.range__price--min');

  var getInput = function (field, i) {
    return field[i] ? field[i] : false;
  };

  var getAmountTypeGood = function (goods, foodType, key) {
    var count = 0;
    goods.forEach(function (good) {
      if (good.kind === foodType) {
        count++;
      }
      if (good.nutritionFacts[key] === foodType) {
        count++;
      }
    });

    return count;
  };

  var getCards = function (cards) {
    return cards;
  };

  var appendItemCount = function () {
    var amount = 0;
    var goods = getCards(window.currentCards);
    var inputs = document.querySelectorAll('.catalog__filter input');

    for (var i = 0; i < inputs.length; i++) {
      var parentElement = window.util.findParentElement(inputs[i], document, 'LI');
      switch (inputs[i].id) {
        case 'filter-icecream':
          amount = getAmountTypeGood(goods, 'Мороженое');
          break;
        case 'filter-soda':
          amount = getAmountTypeGood(goods, 'Газировка');
          break;
        case 'filter-gum':
          amount = getAmountTypeGood(goods, 'Жевательная резинка');
          break;
        case 'filter-marmalade':
          amount = getAmountTypeGood(goods, 'Мармелад');
          break;
        case 'filter-marshmallows':
          amount = getAmountTypeGood(goods, 'Зефир');
          break;
        case 'filter-sugar-free':
          amount = getAmountTypeGood(goods, false, 'sugar');
          break;
        case 'filter-vegetarian':
          amount = getAmountTypeGood(goods, true, 'vegetarian');
          break;
        case 'filter-gluten-free':
          amount = getAmountTypeGood(goods, false, 'gluten');
          break;
        default:
          amount = 0;
          break;
      }
      if (parentElement.querySelector('.input-btn__item-count')) {
        parentElement.querySelector('.input-btn__item-count').textContent = '(' + amount + ')';
      }
    }
  };

  // не знаю как сделать, ведь товара сначала нет...
  setTimeout(function () {
    appendItemCount();
  }, 1500);

  var filterByKind = function (card, target, foodType) {
    if (target[0] === undefined) {
      return true;
    }
    return card['kind'] === foodType[getInput(target, 0).value] ||
      card['kind'] === foodType[getInput(target, 1).value] ||
      card['kind'] === foodType[getInput(target, 2).value] ||
      card['kind'] === foodType[getInput(target, 3).value] ||
      card['kind'] === foodType[getInput(target, 4).value];
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

  var getCoordsElement = function (element) {
    var box = element.getBoundingClientRect();
    return {
      coordXLeft: box.left + window.pageXOffset,
      coordXRight: box.right + window.pageXOffset,
      width: box.width
    };
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

  var sortByFeature = function (target, arr) {
    switch (target) {
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

  var chooseFilter = function (target, arr) {
    if (target === document.querySelector('#filter-' + target.value) && target.checked) {
      var filterByField = arr.filter(function (element) {
        return element[target.value];
      });
      return filterByField;
    }
    return true;
  };

  var renederCatalog = function (target, currentTarget, array, elements) {
    var field;
    var amount = 0;
    var parentElement = window.util.findParentElement(target, currentTarget, 'LI');

    catalogCardsWrap.removeChild(catalogCardsElement);

    if (target.name === 'sort') {
      sortByFeature(target.value, array);
      field = array;

      for (var i = 0; i < array.length; i++) {
        catalogCardsElement.appendChild(array[i].elem);
      }
    }

    if (target.name === 'mark') {
      var filter = chooseFilter(target, array);
      for (var k = 0; k < elements.length; k++) {
        catalogCardsElement.removeChild(elements[k]);
      }

      if (target === document.querySelector('#filter-' + target.value) && !target.checked) {
        showCurrentCards(catalogCardsElement.querySelectorAll('article'));
      }
      field = filter;
      amount = filter.length ? filter.length : 0;
      parentElement.querySelector('.input-btn__item-count').textContent = '(' + amount + ')';
    }

    for (var j = 0; j < field.length; j++) {
      catalogCardsElement.appendChild(field[j].elem);
    }

    catalogCardsWrap.insertBefore(catalogCardsElement, catalogCardsWrap.firstChild);
  };

  var showCurrentCards = function (elements) {
    window.util.changeAttributeFields(document.querySelector('.catalog__sidebar'), 'checked', false);
    for (var k = 0; k < elements.length; k++) {
      catalogCardsElement.removeChild(elements[k]);
    }
    window.appendCards(window.currentCards);
  };

  document.querySelector('.catalog__sidebar').addEventListener('click', function (evt) {
    var target = evt.target;
    var articles = [];
    var catalogCardsElements = catalogCardsElement.querySelectorAll('article');
    var fieldFilter;
    var inputFoodProperty = catalogFilter[1].querySelectorAll('input:checked');
    var inputFoodType = catalogFilter[0].querySelectorAll('input:checked');

    var foodProperty = {
      'sugar-free': ['sugar', false],
      'vegetarian': ['vegetarian', true],
      'gluten-free': ['gluten', false]
    };

    var foodType = {
      'icecream': 'Мороженое',
      'soda': 'Газировка',
      'gum': 'Жевательная резинка',
      'marmalade': 'Мармелад',
      'marshmallows': 'Зефир'
    };

    if (target.classList.contains('catalog__submit')) {
      evt.preventDefault();
      showCurrentCards(catalogCardsElements);
      return;
    }

    if (target.tagName !== 'INPUT') {
      return;
    }

    for (var j = 0; j < catalogCardsElements.length; j++) {
      articles.push({
        elem: catalogCardsElements[j],
        rating: catalogCardsElements[j].querySelector('.star__count').textContent,
        expensive: catalogCardsElements[j].querySelector('.card__price').firstChild.data,
        cheep: catalogCardsElements[j].querySelector('.card__price').firstChild.data,
        availability: !catalogCardsElements[j].classList.contains('card--soon'),
        favorite: catalogCardsElements[j].querySelector('.card__btn-favorite').classList.contains('card__btn-favorite--selected')
      });
    }

    if (target.name === 'mark' || target.name === 'sort') {
      renederCatalog(target, evt.currentTarget, articles, catalogCardsElements);
    }

    if (target.name === 'food-type') {
      fieldFilter = window.currentCards.filter(function (card) {
        return filterByKind(card, inputFoodType, foodType);
      }).filter(function (card) {
        return filterByOneNutritionFacts(card, inputFoodProperty, foodProperty);
      }).filter(function (card) {
        return filterByTwoNutritionFacts(card, inputFoodProperty, foodProperty);
      }).filter(function (card) {
        return filterByThreeNutritionFacts(card, inputFoodProperty, foodProperty);
      });
    }

    if (target.name === 'food-property') {
      fieldFilter = window.currentCards.filter(function (card) {
        return filterByOneNutritionFacts(card, inputFoodProperty, foodProperty);
      }).filter(function (card) {
        return filterByTwoNutritionFacts(card, inputFoodProperty, foodProperty);
      }).filter(function (card) {
        return filterByThreeNutritionFacts(card, inputFoodProperty, foodProperty);
      }).filter(function (card) {
        return filterByKind(card, inputFoodType, foodType);
      });
    }

    if (target.name === 'food-type' || target.name === 'food-property') {
      catalogCardsWrap.removeChild(catalogCardsElement);

      for (var i = 0; i < catalogCardsElements.length; i++) {
        catalogCardsElement.removeChild(catalogCardsElements[i]);
      }
      window.appendCards(fieldFilter);
      catalogCardsWrap.appendChild(catalogCardsElement);
    }
  });

  rangeFilterElement.insertBefore(rangeFillLineElement, rangeFilterElement.firstChild);

  rangeFilterElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoord = {
      x: evt.pageX
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
        x: startCoord.x - evtMousemove.pageX
      };

      startCoord = {
        x: evtMousemove.pageX
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

      if (window.util.checkIsClickFeature(evt.target, 'range__btn--left')) {
        rangeBtnLeftElement.style.left = newCoordsBtn.left + 'px';
        rangeFillLineElement.style.left = newCoordsBtn.left + 'px';
        rangePriceMin.textContent = Math.floor(newCoordsBtn.left);
      }

      if (window.util.checkIsClickFeature(evt.target, 'range__btn--right')) {
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

      shiftBtn.left = isNaN(shiftBtn.left) || shiftBtn.left < MIN_VALUE ? MIN_VALUE : shiftBtn.left;
      shiftBtn.right = isNaN(shiftBtn.right) || shiftBtn.right > coordsRangeBtnRightElement.width ? MIN_VALUE : shiftBtn.right;

      if (evtMouseup.pageX < (coordsRangeBtnRightElement.coordXLeft + coordsRangeBtnLeftElement.coordXLeft) / 2) {
        newCoordsBtn.left = evtMouseup.pageX - coordsRangeFilterElement.coordXLeft - shiftBtn.left;
        if (newCoordsBtn.left <= 0) {
          newCoordsBtn.left = 0;
        }
        rangeBtnLeftElement.style.left = newCoordsBtn.left + 'px';
        rangeFillLineElement.style.left = newCoordsBtn.left + 'px';
        rangePriceMin.textContent = Math.floor(newCoordsBtn.left);
      } else {
        newCoordsBtn.right = evtMouseup.pageX - coordsRangeFilterElement.coordXLeft - shiftBtn.right;
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
})();

