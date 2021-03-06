'use strict';

(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var catalogCardsWrap = document.querySelector('.catalog__cards-wrap');
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

      // shiftBtn.left < 0 - использую, чтобы при перемещении правого пина левее левого, левый получил нужные координаты
      // и передвинулся на новое положение, и наоборот
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

