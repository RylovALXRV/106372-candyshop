'use strict';

(function () {
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

  window.sort = {
    sortFeature: sortByFeature
  };
})();
