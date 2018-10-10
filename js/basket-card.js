'use strict';

(function () {
  var goodCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

  var renderGoodCard = function (goodCard) {
    var element = goodCardTemplate.cloneNode(true);

    element.querySelector('.card-order__img').alt = goodCard.picture;
    element.querySelector('.card-order__img').src = goodCard.img;
    element.querySelector('.card-order__title').textContent = goodCard.name;
    element.querySelector('.card-order__price').textContent = goodCard.price + ' ₽';
    element.querySelector('.card-order__count').id = 'card-order__' + goodCard.picture;
    element.querySelector('.card-order__count').name = goodCard.picture;
    element.querySelector('.card-order__count').value = '1';
    element.dataset.cardAmount = goodCard.availableAmount;
    element.dataset.cardId = goodCard.id;
    return element;
  };

  window.basketCard = {
    render: renderGoodCard
  };
})();
