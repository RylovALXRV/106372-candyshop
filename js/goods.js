'use strict';

(function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  var goodCardsElement = document.querySelector('.goods__cards');

  var onload = function (cards) {
    var fragmentCatalogCards = document.createDocumentFragment();
    cards.forEach(function (card) {
      fragmentCatalogCards.appendChild(window.renderCatalogCard(card));
    });
    catalogCardsElement.appendChild(fragmentCatalogCards);
  };

  window.backend.load(onload, window.util.onError);

  goodCardsElement.classList.remove('goods__cards--empty');
  catalogCardsElement.classList.remove('catalog__cards--load');
})();
