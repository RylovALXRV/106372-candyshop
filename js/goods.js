'use strict';

(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var goodCardsElement = document.querySelector('.goods__cards');
  window.currentCards = [];

  window.appendCards = function (cards) {
    var fragmentCatalogCards = document.createDocumentFragment();
    cards.forEach(function (card) {
      fragmentCatalogCards.appendChild(window.renderCatalogCard(card));
    });
    catalogCardsElement.appendChild(fragmentCatalogCards);
  };

  var onload = function (cards) {
    window.currentCards = cards;
    window.appendCards(cards);
  };

  window.backend.load(onload, window.util.onError);

  goodCardsElement.classList.remove('goods__cards--empty');
  catalogCardsElement.classList.remove('catalog__cards--load');
})();
