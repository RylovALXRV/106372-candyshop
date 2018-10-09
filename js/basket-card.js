'use strict';

(function () {
  var goodCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');

  var renderGoodCard = function (goodCard) {
    var element = goodCardTemplate.cloneNode(true);
    var cardOrderCountElement = element.querySelector('.card-order__count');
    var cardOrderImgElement = element.querySelector('.card-order__img');
    var cardOrderTitleElement = element.querySelector('.card-order__title');
    var visuallyHiddenElement = element.querySelector('.visually-hidden');

    cardOrderImgElement.alt = goodCard.picture;
    cardOrderImgElement.src = goodCard.img;
    cardOrderTitleElement.textContent = goodCard.name;
    element.querySelector('.card-order__price').textContent = goodCard.price + ' ₽';
    visuallyHiddenElement.textContent = 1;
    element.dataset.cardId = goodCard.id;
    element.dataset.cardAmount = goodCard.amount;
    cardOrderCountElement.id = 'card-order__' + goodCard.picture;
    cardOrderCountElement.name = goodCard.picture;
    cardOrderCountElement.value = visuallyHiddenElement.textContent;
    return element;
  };

  window.basketCard = {
    render: renderGoodCard
  };
})();
