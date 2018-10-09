'use strict';

(function () {
  var mainHeaderBasket = document.querySelector('.main-header__basket');

  var clearBasket = function () {
    mainHeaderBasket.textContent = 'В корзине ничего нет';
  };

  var setText = function (elements, totalSum) {
    mainHeaderBasket.textContent = 'В корзине ' + window.basket.getGoodsAmount(elements) + ' ' + window.basket.getRightString(elements) + ' на ' + totalSum;
  };

  window.headerBasket = {
    clear: clearBasket,
    setText: setText
  };
})();
