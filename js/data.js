'use strict';

window.data = (function () {
  return {
    checkIsClickFeature: function (target, className) {
      return target.classList.contains(className);
    },
    checkIsEmptyBasket: function (element) {
      return element.contains(element.querySelector('article'));
    },
    checkIsNumeric: function (value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    }
  };
})();
