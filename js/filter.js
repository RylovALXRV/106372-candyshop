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
  var emptyFiltersTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');

  var renderEmptyFilters = function () {
    var element = emptyFiltersTemplate.cloneNode(true);
    element.classList.add('visually-hidden');
    return element;
  };

  var setRangeCountField = function (goods, cards) {
    document.querySelector('span.range__count').textContent = '(' + goods.length + ')';
    var leftBtnStyle = parseFloat(getComputedStyle(document.querySelector('.range__btn--left')).left);
    var rightBtnStyle = parseFloat(getComputedStyle(document.querySelector('.range__btn--right')).left);
    var coords = document.querySelector('.range__filter').getBoundingClientRect().width;
    rangePriceMin.textContent = getPrice(cards, coords, leftBtnStyle);
    rangePriceMax.textContent = getPrice(cards, coords, rightBtnStyle);
  };

  var getInput = function (field, i) {
    return field[i] ? field[i] : false;
  };

  var getAmountTypeGood = function (goods, foodType, key) {
    var count = 0;
    var countAmount = 0;
    goods.forEach(function (good) {
      if (good.amount > 0) {
        countAmount++;
      }
      if (good.kind === foodType) {
        count++;
      }
      if (good.nutritionFacts[key] === foodType) {
        count++;
      }
    });
    return count || countAmount;
  };

  var appendItemCount = function (goods) {
    var amount = 0;
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
        case 'filter-availability':
          amount = getAmountTypeGood(goods);
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
    appendItemCount(window.catalog.cards());
    setRangeCountField(catalogCardsElement.querySelectorAll('article'), window.catalog.cards());
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
    return b.price - a.price;
  };

  var sortByPopular = function (a, b) {
    return a.elem.dataset.id - b.elem.dataset.id;
  };

  var sortByRating = function (a, b) {
    return b.rating - a.rating;
  };

  var sortBySmallToBigPrice = function (a, b) {
    return a.price - b.price;
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

  var renederCatalog = function (evt, array, elements, cards) {
    var field;
    var amount = 0;
    var parentElement = window.util.findParentElement(evt.target, evt.currentTarget, 'LI');

    catalogCardsWrap.removeChild(catalogCardsElement);

    if (evt.target.name === 'sort') {
      sortByFeature(evt.target.value, array);
      field = array;

      for (var i = 0; i < array.length; i++) {
        catalogCardsElement.appendChild(array[i].elem);
      }
    }

    if (evt.target.name === 'mark') {
      var filter = chooseFilter(evt.target, array);
      for (var k = 0; k < elements.length; k++) {
        catalogCardsElement.removeChild(elements[k]);
      }
      if (evt.target === document.querySelector('#filter-' + evt.target.value) && !evt.target.checked) {
        showCurrentCards(catalogCardsElement.querySelectorAll('article'), cards);
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

  var showCurrentCards = function (elements, cards) {
    window.util.changeAttributeFields(document.querySelector('.catalog__sidebar'), 'checked', false);
    for (var k = 0; k < elements.length; k++) {
      catalogCardsElement.removeChild(elements[k]);
    }
    window.catalog.appendCards(cards);
  };

  catalogCardsElement.appendChild(renderEmptyFilters());

  document.querySelector('.catalog__sidebar').addEventListener('click', function (evt) {
    var target = evt.target;
    var buttonRange = target.closest('.range__btn');
    var catalogCardsElements = catalogCardsElement.querySelectorAll('article');
    var catalogEmptyFilterElement = document.querySelector('.catalog__empty-filter');
    var fieldFilter;
    var inputFoodProperty = catalogFilter[1].querySelectorAll('input:checked');
    var inputFoodType = catalogFilter[0].querySelectorAll('input:checked');
    var articles = [];
    var currentCards = window.catalog.cards();

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

    for (var j = 0; j < catalogCardsElements.length; j++) {
      articles.push({
        elem: catalogCardsElements[j],
        rating: catalogCardsElements[j].querySelector('.star__count').textContent,
        availability: !catalogCardsElements[j].classList.contains('card--soon'),
        favorite: catalogCardsElements[j].querySelector('.card__btn-favorite').classList.contains('card__btn-favorite--selected'),
        price: catalogCardsElements[j].querySelector('.card__price').firstChild.data
      });
    }

    if (target.classList.contains('catalog__submit')) {
      evt.preventDefault();
      showCurrentCards(catalogCardsElements, currentCards);
      catalogEmptyFilterElement.classList.add('visually-hidden');
      return;
    }

    if (target.tagName === 'INPUT') {
      if (target.name === 'food-type') {
        fieldFilter = currentCards.filter(function (card) {
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
        fieldFilter = currentCards.filter(function (card) {
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
        window.catalog.appendCards(fieldFilter);
        catalogCardsWrap.appendChild(catalogCardsElement);
      }
      if (target.name === 'mark' || target.name === 'sort') {
        renederCatalog(evt, articles, catalogCardsElements, currentCards);
      }
    }

    if (buttonRange) {
      var filterRangeCount = articles.filter(function (article) {
        return article.price >= document.querySelector('.range__price--min').textContent && article.price <= document.querySelector('.range__price--max').textContent;
      });
      catalogCardsWrap.removeChild(catalogCardsElement);
      for (var m = 0; m < catalogCardsElements.length; m++) {
        catalogCardsElement.removeChild(catalogCardsElements[m]);
      }
      for (var n = 0; n < filterRangeCount.length; n++) {
        catalogCardsElement.appendChild(filterRangeCount[n].elem);
      }
      catalogCardsWrap.appendChild(catalogCardsElement);
    }

    if (!catalogCardsElement.querySelectorAll('article').length) {
      catalogEmptyFilterElement.classList.remove('visually-hidden');
    } else {
      catalogEmptyFilterElement.classList.add('visually-hidden');
    }
  });

  var getMaxPrice = function (goods) {
    var maxPrice = 0;
    goods.forEach(function (good) {
      if (maxPrice < good.price) {
        maxPrice = good.price;
      }
    });
    return maxPrice;
  };

  var getPrice = function (goods, width, coord) {
    var priceMax = getMaxPrice(goods);
    return Math.floor(coord * priceMax / (width - 10));
  };

  document.querySelector('section.catalog__filter').addEventListener('mousedown', function (evt) {
    var target = evt.target;

    var buttonTarget = target.closest('.range__btn');
    if (!buttonTarget) {
      return;
    }

    document.querySelector('span.range__count').textContent = '(' + catalogCardsElement.querySelectorAll('article').length + ')';
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
        rangePriceMin.textContent = getPrice(window.catalog.cards(), coordsRangeFilterElement.width, newCoordsBtn.left);
      }

      if (window.util.checkIsClickFeature(evt.target, 'range__btn--right')) {
        rangeBtnRightElement.style.left = newCoordsBtn.right + 'px';
        rangeFillLineElement.style.right = coordsRangeFilterElement.width - coordsRangeBtnRightElement.width - newCoordsBtn.right + 'px';
        rangePriceMax.textContent = getPrice(window.catalog.cards(), coordsRangeFilterElement.width, newCoordsBtn.right);
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
        rangePriceMin.textContent = getPrice(window.catalog.cards(), coordsRangeFilterElement.width, newCoordsBtn.left);
      } else {
        newCoordsBtn.right = evtMouseup.pageX - coordsRangeFilterElement.coordXLeft - shiftBtn.right;
        if (newCoordsBtn.right >= coordsRangeFilterElement.width - coordsRangeBtnRightElement.width) {
          newCoordsBtn.right = coordsRangeFilterElement.width - coordsRangeBtnRightElement.width;
        }
        rangeBtnRightElement.style.left = newCoordsBtn.right + 'px';
        rangeFillLineElement.style.right = coordsRangeFilterElement.width - coordsRangeBtnRightElement.width - newCoordsBtn.right + 'px';
        rangePriceMax.textContent = getPrice(window.catalog.cards(), coordsRangeFilterElement.width, newCoordsBtn.right);
      }
      document.removeEventListener('mousemove', onButtonMousemove);
      document.removeEventListener('mouseup', onButtonMouseup);
    };

    document.addEventListener('mousemove', onButtonMousemove);
    document.addEventListener('mouseup', onButtonMouseup);
  });
})();

