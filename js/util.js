'use strict';

window.util = (function () {
  return {
    checkIsClickFeature: function (target, className) {
      return target.classList.contains(className);
    },
    checkIsEmptyBasket: function (element) {
      return element.contains(element.querySelector('article'));
    },
    checkIsNumeric: function (value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },
    getRandomElement: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    getRandomValue: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },
    onError: function (errorMessage) {
      var modalErrorElement = document.querySelector('.modal--error');
      modalErrorElement.classList.remove('modal--hidden');
      modalErrorElement.querySelector('.modal__message').textContent = errorMessage;
    }
  };
})();
