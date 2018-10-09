'use strict';

(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var goodCardsElement = document.querySelector('.goods__cards');

  var currentCards = [];

  var appendCards = function (cards) {
    var fragmentCatalogCards = document.createDocumentFragment();
    cards.forEach(function (card) {
      fragmentCatalogCards.appendChild(window.card.render(card));
    });
    catalogCardsElement.appendChild(fragmentCatalogCards);
  };

  var changeFeatureForGood = function (target, className) {
    target.classList.toggle(className);
  };

  var onLoad = function (cards) {
    catalogCardsElement.classList.remove('catalog__cards--load');
    currentCards = cards;
    appendCards(cards);
  };

  var getCurrentCards = function () {
    return currentCards;
  };

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
    if (target.classList.contains('card__btn')) {
      window.basket.appendGood(target, evt.currentTarget, parentElement);
    }

    if (window.basket.checkGood() && parentElement.dataset.amount > 0) {
      window.headerBasket.setText(goodCardsElement.querySelectorAll('article'), window.basket.getTotalAmount());
    }
  });

  window.catalog = {
    appendCards: appendCards,
    cards: getCurrentCards
  };
})();
