'use strict';

(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var catalogCardsWrap = document.querySelector('.catalog__cards-wrap');
  var catalogFilter = document.querySelectorAll('.catalog__filter');
  var rangeFillLineElement = document.querySelector('.range__fill-line');
  var rangeFilterElement = document.querySelector('.range__filter');
  var rangePriceMax = document.querySelector('.range__price--max');
  var rangePriceMin = document.querySelector('.range__price--min');
  var emptyFiltersTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');

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

  var setRangeCountField = function (goods, cards) {
    document.querySelector('span.range__count').textContent = '(' + goods.length + ')';
    var leftBtnStyle = parseFloat(getComputedStyle(document.querySelector('.range__btn--left')).left);
    var rightBtnStyle = parseFloat(getComputedStyle(document.querySelector('.range__btn--right')).left);
    var coords = document.querySelector('.range__filter').getBoundingClientRect().width;
    rangePriceMin.textContent = getPrice(cards, coords, leftBtnStyle);
    rangePriceMax.textContent = getPrice(cards, coords, rightBtnStyle);
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

  var renderEmptyFilters = function () {
    var element = emptyFiltersTemplate.cloneNode(true);
    element.classList.add('visually-hidden');
    return element;
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
      window.sort.sortFeature(evt.target.value, array);
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
          return window.filterKind.filterByKind(card, inputFoodType, foodType);
        }).filter(function (card) {
          return window.filterNutritionFacts.filterByOneNutritionFacts(card, inputFoodProperty, foodProperty);
        }).filter(function (card) {
          return window.filterNutritionFacts.filterByTwoNutritionFacts(card, inputFoodProperty, foodProperty);
        }).filter(function (card) {
          return window.filterNutritionFacts.filterByThreeNutritionFacts(card, inputFoodProperty, foodProperty);
        });
      }

      if (target.name === 'food-property') {
        fieldFilter = currentCards.filter(function (card) {
          return window.filterNutritionFacts.filterByOneNutritionFacts(card, inputFoodProperty, foodProperty);
        }).filter(function (card) {
          return window.filterNutritionFacts.filterByTwoNutritionFacts(card, inputFoodProperty, foodProperty);
        }).filter(function (card) {
          return window.filterNutritionFacts.filterByThreeNutritionFacts(card, inputFoodProperty, foodProperty);
        }).filter(function (card) {
          return window.filterKind.filterByKind(card, inputFoodType, foodType);
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

  document.querySelector('section.catalog__filter').addEventListener('mousedown', function (evt) {
    var target = evt.target;

    var buttonTarget = target.closest('.range__btn');
    if (!buttonTarget) {
      return;
    }

    document.querySelector('span.range__count').textContent = '(' + catalogCardsElement.querySelectorAll('article').length + ')';
  });

  rangeFilterElement.insertBefore(rangeFillLineElement, rangeFilterElement.firstChild);

  // не знаю как сделать, ведь товара сначала нет...
  setTimeout(function () {
    appendItemCount(window.catalog.cards());
    setRangeCountField(catalogCardsElement.querySelectorAll('article'), window.catalog.cards());
  }, 1500);

  window.filter = {
    appendItemCount: appendItemCount,
    setRangeCountField: setRangeCountField
  };
})();
