'use strict';

(function () {
  var goodCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

  var renderGoodCard = function (goodCard) {
    var element = goodCardTemplate.cloneNode(true);
    var cardOrderTitleElement = element.querySelector('.card-order__title');
    cardOrderTitleElement.textContent = goodCard.name;
    element.querySelector('.card-order__img').src = goodCard.img;
    element.querySelector('.card-order__price').textContent = goodCard.price + ' ₽';
    element.querySelector('.visually-hidden').textContent = goodCard.amount;
    element.querySelector('.visually-hidden').textContent = 1;
    element.querySelector('input.card-order__count').name = goodCard.picture;
    element.querySelector('input.card-order__count').id = 'card-order__' + goodCard.picture;
    element.querySelector('.card-order__count').value = element.querySelector('.visually-hidden').textContent;
    element.dataset.cardId = goodCard.id;
    element.dataset.cardAmount = goodCard.amount;
    return element;
  };

  window.basketCard = {
    render: renderGoodCard
  };
})();
