'use strict';

(function () {
  var catalogCardTemplate = document.querySelector('#card').content.querySelector('.card');
  var dataId = 1;

  var getOriginalAlt = function (picture) {
    var originalAltName = picture.split('.');
    return originalAltName[0];
  };

  var setClassAccordingToRating = function (rating, element) {
    switch (rating) {
      case 1:
        element.classList.add('stars__rating--one');
        return;
      case 2:
        element.classList.add('stars__rating--two');
        return;
      case 3:
        element.classList.add('stars__rating--three');
        return;
      case 4:
        element.classList.add('stars__rating--four');
        return;
      case 5:
        element.classList.add('stars__rating--five');
        return;
    }
  };

  var setClassAccordingToAmount = function (amount, element) {
    if (amount > 5) {
      element.classList.add('card--in-stock');
    } else if (amount >= 1) {
      element.classList.add('card--little');
    } else {
      element.classList.add('card--soon');
    }
  };

  var setClassAccordingToIsSugar = function (isSugar, element) {
    if (isSugar) {
      element.querySelector('.card__characteristic').textContent = 'Содержит сахар';
    } else {
      element.querySelector('.card__characteristic').textContent = 'Без сахара';
    }
  };

  var renderCatalogCard = function (card) {
    var element = catalogCardTemplate.cloneNode(true);
    var cardImgElement = element.querySelector('.card__img');
    cardImgElement.alt = getOriginalAlt(card.picture);
    cardImgElement.src = 'img/cards/' + card.picture;
    element.querySelector('.card__composition-list').textContent = card.nutritionFacts.contents;
    element.querySelector('.card__price').firstChild.data = card.price + ' ';
    element.querySelector('.card__title').textContent = card.name;
    element.querySelector('.card__weight').textContent = '/ ' + card.weight + ' Г';
    element.querySelector('.star__count').textContent = card.rating.number;
    element.dataset.id = dataId++;
    element.dataset.amount = card.amount;
    setClassAccordingToAmount(card.amount, element);
    setClassAccordingToIsSugar(card.nutritionFacts.sugar, element);
    setClassAccordingToRating(card.rating.value, element.querySelector('.stars__rating'));
    return element;
  };

  window.card = {
    render: renderCatalogCard
  };
})();
