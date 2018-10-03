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
    onError: function (errorMessage) {
      var modalErrorElement = document.querySelector('.modal--error');
      modalErrorElement.classList.remove('modal--hidden');
      modalErrorElement.querySelector('.modal__message').textContent = errorMessage;
    },
    changeAttributeFields: function (element, attribute, boolean) {
      var inputs = element.querySelectorAll('input');
      for (var i = 0; i < inputs.length; i++) {
        inputs[i][attribute] = boolean;
      }
    },
    findParentElement: function (target, currentEvt, tagName) {
      while (target.tagName !== currentEvt) {
        if (target.tagName === tagName) {
          break;
        }
        target = target.parentNode;
      }
      return target;
    }
  };
})();
