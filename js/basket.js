'use strict';

(function () {
  var formElement = document.querySelector('.buy form');
  var goodCardsElement = document.querySelector('.goods__cards');
  var goodsCardEmptyElement = document.querySelector('.goods__card-empty');
  var goodsPriceElement = document.querySelector('.goods__price');
  var goodsTotalElement = document.querySelector('.goods__total');
  var goodInBasket = [];

  var getSumElement = function (target, currentTarget) {
    return parseFloat(window.util.findParentElement(target, currentTarget, 'ARTICLE').querySelector('.card__price').firstChild.data);
  };

  var deleteGood = function (target) {
    target.parentNode.remove();
  };

  var changeValueFields = function (target, value) {
    var cardOrderCountElement = target.querySelector('.card-order__count');
    var cardOrderPriceElement = target.querySelector('.card-order__price');
    var goodAmount = parseFloat(cardOrderCountElement.value) + value;
    if (goodAmount <= parseFloat(target.dataset.cardAmount)) {
      cardOrderCountElement.value = parseFloat(cardOrderCountElement.value) + value;
      goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) + value * parseFloat(cardOrderPriceElement.textContent) + ' ₽';
    }
  };

  var changeGoodAmount = function (target, currentTarget, value) {
    while (target.tagName !== currentTarget) {
      if (target.tagName === 'ARTICLE') {
        changeValueFields(target, value);
        if (parseFloat(target.querySelector('.card-order__count').value) <= 0) {
          target.remove();
        }
        return;
      }
      target = target.parentNode;
    }
  };

  var getGoodsAmountInBasket = function (goods) {
    var amountGoods = [];
    for (var i = 0; i < goods.length; i++) {
      amountGoods.push(goods[i]);
    }
    return amountGoods.length;
  };

  var getGoodsAmount = function (element) {
    var goodsAmount = 0;
    for (var j = 0; j < element.length; j++) {
      goodsAmount++;
    }
    return goodsAmount;
  };

  var getTotalAmount = function () {
    return goodsPriceElement.textContent;
  };

  var checkBasketFullness = function () {
    if (goodCardsElement.querySelector('article')) {
      window.order.enableForm();
      goodsCardEmptyElement.classList.add('visually-hidden');
      goodsTotalElement.classList.remove('visually-hidden');
      return true;
    } else {
      window.order.disableForm();
      goodsCardEmptyElement.classList.remove('visually-hidden');
      goodsTotalElement.classList.add('visually-hidden');
      return false;
    }
  };

  var getRightString = function (element) {
    element = element.length.toString();
    var string = '';
    switch (element[element.length - 1]) {
      case '1':
        string = 'товар';
        break;
      case '2':
      case '3':
      case '4':
        string = 'товара';
        break;
      default:
        string = 'товаров';
        break;
    }
    if (element >= 10 && element <= 20) {
      string = 'товаров';
    }
    return string;
  };

  var addNewGood = function (card) {
    goodCardsElement.appendChild(window.basketCard.render(card));
  };

  var isGoodInBasket = function (goodElement) {
    var goodCardElements = goodCardsElement.querySelectorAll('article');
    for (var i = 0; i < goodCardElements.length; i++) {
      if (goodCardElements[i].dataset.cardId === goodElement.dataset.id) {
        changeGoodAmount(goodCardElements[i], goodCardsElement, 1);
        return true;
      }
    }
    return false;
  };

  var appendGood = function (target, currentTarget, goodElement) {
    if (isGoodInBasket(goodElement) || parseFloat(goodElement.dataset.amount) === 0) {
      return;
    }

    var newGood = {
      amount: 1,
      availableAmount: goodElement.dataset.amount,
      id: goodElement.dataset.id,
      img: goodElement.querySelector('.card__img').src,
      name: goodElement.querySelector('.card__title').textContent,
      picture: goodElement.querySelector('.card__img').alt,
      price: goodElement.querySelector('.card__price').firstChild.data
    };

    goodInBasket.push(newGood);

    addNewGood(newGood);

    setTotalInBasket(goodCardsElement.querySelectorAll('article'));
    goodsPriceElement.textContent = parseFloat(document.querySelector('.goods__price').textContent) + getSumElement(target, currentTarget) + '₽';
  };

  var setTotalInBasket = function (elements) {
    document.querySelector('.goods__total-count').firstChild.data = 'Итого за ' + getGoodsAmountInBasket(elements) + ' ' + getRightString(elements) + ':';
  };

  var setTotalGoodsAmount = function (elements) {
    setTotalInBasket(elements);
    window.headerBasket.setText(elements, goodsPriceElement.textContent);
  };

  var resetValueInputs = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].value = '';
    }
  };

  var clearBasket = function () {
    var articles = goodCardsElement.querySelectorAll('article');
    for (var i = 0; i < articles.length; i++) {
      goodCardsElement.removeChild(articles[i]);
    }
    window.order.disableForm();
    resetValueInputs(formElement.querySelectorAll('input'));
    document.querySelector('.modal--success').classList.remove('modal--hidden');
    goodsPriceElement.textContent = '0 ₽';
    goodsTotalElement.classList.add('visually-hidden');
    goodsCardEmptyElement.classList.remove('visually-hidden');
    window.headerBasket.clear();
    goodInBasket = [];
  };

  var onLoad = function () {
    clearBasket();
  };

  var setTotalSumItems = function (elem) {
    return parseFloat(elem.querySelector('.card-order__price').textContent) * elem.querySelector('.card-order__count').value;
  };

  goodCardsElement.classList.remove('goods__cards--empty');

  goodCardsElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var currentTarget = evt.currentTarget;

    if (target.tagName === 'A' && target.classList.contains('card-order__close')) {
      var parentTarget = window.util.findParentElement(target, currentTarget, 'ARTICLE');
      deleteGood(target);
      goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) - setTotalSumItems(parentTarget) + ' ₽';
      setTotalGoodsAmount(goodCardsElement.querySelectorAll('article'));
    }

    if (target.tagName === 'BUTTON' && window.util.checkIsClickFeature(target, 'card-order__btn--increase')) {
      changeGoodAmount(target, currentTarget, 1);
    } else if (target.tagName === 'BUTTON' && window.util.checkIsClickFeature(target, 'card-order__btn--decrease')) {
      changeGoodAmount(target, currentTarget, -1);
    }

    if (checkBasketFullness()) {
      setTotalGoodsAmount(goodCardsElement.querySelectorAll('article'));
    } else {
      window.headerBasket.clear();
    }
  });

  document.addEventListener('click', function (evt) {
    var target = evt.target;
    var currentTarget = evt.currentTarget;

    var element = target.closest('.modal__close');

    if (!element) {
      return;
    }
    var parentElement = window.util.findParentElement(target, currentTarget, 'SECTION');
    parentElement.classList.add('modal--hidden');
  });

  formElement.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(formElement), onLoad, window.util.onError);
    evt.preventDefault();
  });

  window.basket = {
    appendGood: appendGood,
    checkGood: checkBasketFullness,
    getGoodsAmount: getGoodsAmount,
    getTotalAmount: getTotalAmount,
    getRightString: getRightString
  };
})();
