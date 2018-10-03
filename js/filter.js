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
        count = goods.length;
      }
    });

    return count;
  };

  var appendItemCount = function (target, currentTarget, typeFilter) {
    var amount = 0;
    var parentElement = window.util.findParentElement(target, currentTarget, 'LI');

    switch (target.id) {
      case 'filter-icecream':
        amount = getAmountTypeGood(typeFilter, 'Мороженое');
        break;
      case 'filter-soda':
        amount = getAmountTypeGood(typeFilter, 'Газировка');
        break;
      case 'filter-gum':
        amount = getAmountTypeGood(typeFilter, 'Жевательная резинка');
        break;
      case 'filter-marmalade':
        amount = getAmountTypeGood(typeFilter, 'Мармелад');
        break;
      case 'filter-marshmallows':
        amount = getAmountTypeGood(typeFilter, 'Зефир');
        break;
    }
    parentElement.querySelector('.input-btn__item-count').textContent = '(' + amount + ')';
  };

  var appendItem = function (target, currentTarget, typeFilter, inputs) {
    var amount = 0;

    switch (target.id) {
      case 'filter-sugar-free':
        amount = getAmountTypeGood(typeFilter, false, 'sugar');
        break;
      case 'filter-vegetarian':
        amount = getAmountTypeGood(typeFilter, true, 'vegetarian');
        break;
      case 'filter-gluten-free':
        amount = getAmountTypeGood(typeFilter, false, 'gluten');
        break;
    }

    for (var i = 0; i < inputs.length; i++) {
      var parentElement = window.util.findParentElement(inputs[i], currentTarget, 'LI');
      parentElement.querySelector('.input-btn__item-count').textContent = '(' + amount + ')';
    }
  };

  catalogFilter[0].addEventListener('click', function (evt) {
    var target = evt.target;
    var currentTarget = evt.target;

    if (target.tagName !== 'INPUT') {
      return;
    }
    var articles = catalogCardsElement.querySelectorAll('article');
    var inputFoodType = catalogFilter[0].querySelectorAll('input:checked');

    var foodType = {
      'icecream': 'Мороженое',
      'soda': 'Газировка',
      'gum': 'Жевательная резинка',
      'marmalade': 'Мармелад',
      'marshmallows': 'Зефир'
    };

    var foodTypeFilter = window.currentCards.filter(function (card) {
      return card['kind'] === foodType[getInput(inputFoodType, 0).value] ||
        card['kind'] === foodType[getInput(inputFoodType, 1).value] ||
        card['kind'] === foodType[getInput(inputFoodType, 2).value] ||
        card['kind'] === foodType[getInput(inputFoodType, 3).value] ||
        card['kind'] === foodType[getInput(inputFoodType, 4).value];
    });

    appendItemCount(target, currentTarget, foodTypeFilter);

    catalogCardsWrap.removeChild(catalogCardsElement);

    for (var i = 0; i < articles.length; i++) {
      catalogCardsElement.removeChild(articles[i]);
    }

    window.appendCards(foodTypeFilter);
    catalogCardsWrap.appendChild(catalogCardsElement);
  });

  catalogFilter[1].addEventListener('click', function (evt) {
    var target = evt.target;
    var currentTarget = evt.currentTarget;
    var articles = catalogCardsElement.querySelectorAll('article');
    var inputFoodProperty = catalogFilter[1].querySelectorAll('input:checked');

    if (target.tagName !== 'INPUT') {
      return;
    }

    var foodProperty = {
      'sugar-free': ['sugar', false],
      'vegetarian': ['vegetarian', true],
      'gluten-free': ['gluten', false]
    };

    var foodPropertyFilter = window.currentCards.filter(function (card) {
      if (inputFoodProperty[0] === undefined) {
        return true;
      }
      return card['nutritionFacts'][foodProperty[getInput(inputFoodProperty, 0).value][0]] === foodProperty[getInput(inputFoodProperty, 0).value][1];
    }).filter(function (card) {
      if (inputFoodProperty[1] === undefined && inputFoodProperty[2] === undefined) {
        return true;
      }
      return card['nutritionFacts'][foodProperty[getInput(inputFoodProperty, 0).value][0]] === foodProperty[getInput(inputFoodProperty, 0).value][1] &&
        card['nutritionFacts'][foodProperty[getInput(inputFoodProperty, 1).value][0]] === foodProperty[getInput(inputFoodProperty, 1).value][1];
    }).filter(function (card) {
      if (inputFoodProperty[1] === undefined || inputFoodProperty[2] === undefined) {
        return true;
      }
      return card['nutritionFacts'][foodProperty[getInput(inputFoodProperty, 0).value][0]] === foodProperty[getInput(inputFoodProperty, 0).value][1] &&
        card['nutritionFacts'][foodProperty[getInput(inputFoodProperty, 1).value][0]] === foodProperty[getInput(inputFoodProperty, 1).value][1] &&
        card['nutritionFacts'][foodProperty[getInput(inputFoodProperty, 2).value][0]] === foodProperty[getInput(inputFoodProperty, 2).value][1];
    });

    // var sugarFreeCount = getAmountTypeGood(foodPropertyFilter, foodProperty['sugar-free'][1]);
    // var vegetarianCount = getAmountTypeGood(foodPropertyFilter, foodProperty['vegetarian'][1]);
    // var glutenFreeCount;

    appendItem(target, currentTarget, foodPropertyFilter, inputFoodProperty);

    catalogCardsWrap.removeChild(catalogCardsElement);

    for (var i = 0; i < articles.length; i++) {
      catalogCardsElement.removeChild(articles[i]);
    }

    window.appendCards(foodPropertyFilter);
    catalogCardsWrap.appendChild(catalogCardsElement);
  });

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
    var currentTarget = evt. currentTarget;
    var catalogCardsElements = catalogCardsElement.querySelectorAll('article');

    if (target.classList.contains('catalog__submit')) {
      evt.preventDefault();
      showCurrentCards(catalogCardsElements);
      return;
    }

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
        availability: !catalogCardsElements[j].classList.contains('card--soon'),
        favorite: catalogCardsElements[j].querySelector('.card__btn-favorite').classList.contains('card__btn-favorite--selected')
      });
    }
    if (target.name === 'mark' || target.name === 'sort') {
      renederCatalog(target, currentTarget, articles, catalogCardsElements);
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

