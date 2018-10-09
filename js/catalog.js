'use strict';

(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var goodsPriceElement = document.querySelector('.goods__price');
  var goodCardsElement = document.querySelector('.goods__cards');
  var orderElement = document.querySelector('.order');

  var currentCards = [];

  var changeFeatureForGood = function (target, className) {
    target.classList.toggle(className);
  };

  var getSumElement = function (target, currentTarget) {
    return parseFloat(window.util.findParentElement(target, currentTarget, 'ARTICLE').querySelector('.card__price').firstChild.data);
  };

  var setGoodsAmountInBasket = function (target, currentTarget) {
    var goodCardElements = goodCardsElement.querySelectorAll('article');
    var goodAmount = 0;
    for (var i = 0; i < goodCardElements.length; i++) {
      var cardOrderCountElement = goodCardElements[i].querySelector('.card-order__count');
      if (goodCardElements && currentTarget.dataset.id === goodCardElements[i].dataset.cardId) {
        goodAmount = parseFloat(cardOrderCountElement.value) + 1;
        if (goodAmount <= goodCardElements[i].dataset.cardAmount) {
          cardOrderCountElement.value = parseFloat(cardOrderCountElement.value) + 1;
          goodsPriceElement.textContent = parseFloat(document.querySelector('.goods__price').textContent) + getSumElement(target, currentTarget) + '₽';
        }
        return false;
      }
    }
    return true;
  };

  var appendCards = function (cards) {
    var fragmentCatalogCards = document.createDocumentFragment();
    cards.forEach(function (card) {
      fragmentCatalogCards.appendChild(window.card.render(card));
    });
    catalogCardsElement.appendChild(fragmentCatalogCards);
  };

  var onLoad = function (cards) {
    currentCards = cards;
    appendCards(cards);
  };

  var getCurrentCards = function () {
    return currentCards;
  };

  goodCardsElement.classList.remove('goods__cards--empty');
  catalogCardsElement.classList.remove('catalog__cards--load');
  window.util.changeAttributeFields(orderElement, 'disabled', true);
  window.backend.load(onLoad, window.util.onError);

  catalogCardsElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;

    var parentElement = window.util.findParentElement(target, evt.currentTarget, 'ARTICLE');

    if (!parentElement.closest('.catalog__card')) {
      return;
    }

    if (window.util.checkIsClickFeature(target, 'card__btn-favorite')) {
      changeFeatureForGood(target, 'card__btn-favorite--selected', 'card__btn-favorite');
    }
    if (window.util.checkIsClickFeature(target, 'card__btn-composition')) {
      changeFeatureForGood(parentElement.querySelector('.card__composition'), 'card__composition--hidden', 'card__btn-composition');
    }
    if (!target.classList.contains('card__btn')) {
      return;
    }

    var goodCard = {
      amount: parentElement.dataset.amount,
      id: parentElement.dataset.id,
      img: parentElement.querySelector('.card__img').src,
      name: parentElement.querySelector('.card__title').textContent,
      picture: parentElement.querySelector('.card__img').alt,
      price: parentElement.querySelector('.card__price').firstChild.data
    };

    if (setGoodsAmountInBasket(target, parentElement) && parentElement.dataset.amount > 0) {
      window.basket.appendGood(goodCard);
      window.basket.setTotalInBasket(goodCardsElement.querySelectorAll('article'));
      goodsPriceElement.textContent = parseFloat(window.basket.getTotalAmount()) + getSumElement(target, parentElement) + '₽';
    }

    if (window.basket.checkGood() && parentElement.dataset.amount > 0) {
      window.headerBasket.setText(goodCardsElement.querySelectorAll('article'), goodsPriceElement.textContent);
    }
  });

  window.catalog = {
    appendCards: appendCards,
    cards: getCurrentCards
  };
})();
