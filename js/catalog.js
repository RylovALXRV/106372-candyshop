'use strict';

(function () {
  var formElement = document.querySelector('.buy form');
  var goodsCardEmptyElement = document.querySelector('.goods__card-empty');
  var goodsPriceElement = document.querySelector('.goods__price');
  var goodsTotalElement = document.querySelector('.goods__total');
  var goodCardTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var goodCardsElement = document.querySelector('.goods__cards');

  var changeBlockFields = function (element, attribute, boolean) {
    var inputs = element.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i][attribute] = boolean;
    }
  };

  var changeFeatureForGood = function (target, className) {
    target.classList.toggle(className);
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

  var changeTextForBasket = function (isEmpty) {
    if (!isEmpty) {
      changeBlockFields(document.querySelector('.order'), 'disabled', true);
      changeBlockFields(document.querySelector('.order'), 'required', false);
      goodsCardEmptyElement.classList.remove('visually-hidden');
      goodsTotalElement.classList.add('visually-hidden');
      return true;
    } else {
      changeBlockFields(document.querySelector('.order'), 'disabled', false);
      goodsCardEmptyElement.classList.add('visually-hidden');
      goodsTotalElement.classList.remove('visually-hidden');
      return false;
    }
  };

  var changeValueFields = function (target, value) {
    var cardOrderCountElement = target.querySelector('.card-order__count');
    var cardOrderPriceElement = target.querySelector('.card-order__price');

    cardOrderCountElement.value = parseFloat(cardOrderCountElement.value) + value;
    goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) + value * parseFloat(cardOrderPriceElement.textContent) + ' ₽';
  };

  var findParentElement = function (target, currentEvt, tagName) {
    while (target.tagName !== currentEvt) {
      if (target.tagName === tagName) {
        break;
      }
      target = target.parentNode;
    }
    return target;
  };

  var getGoodsAmount = function (element) {
    var goodsAmount = 0;
    for (var j = 0; j < element.length; j++) {
      goodsAmount++;
    }
    return goodsAmount;
  };

  var getGoodsAmountInBasket = function (goods) {
    return goods.length;
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

  var getSumElement = function (target, currentTarget) {
    return parseFloat(findParentElement(target, currentTarget, 'ARTICLE').querySelector('.card__price').firstChild.data);
  };

  var renderGoodCard = function (goodCard) {
    var element = goodCardTemplate.cloneNode(true);
    element.querySelector('.card-order__img').src = goodCard.img;
    element.querySelector('.card-order__price').textContent = goodCard.price + ' ₽';
    element.querySelector('.card-order__title').textContent = goodCard.name;
    element.querySelector('.visually-hidden').textContent = goodCard.amount;
    element.querySelector('.visually-hidden').textContent = 1;
    element.querySelector('.card-order__count').value = element.querySelector('.visually-hidden').textContent;
    element.dataset.cardId = goodCard.id;
    return element;
  };

  var setGoodsAmountInBasket = function (target, currentTarget) {
    var goodCardsElements = goodCardsElement.querySelectorAll('article');
    for (var i = 0; i < goodCardsElements.length; i++) {
      if (goodCardsElements && currentTarget.dataset.id === goodCardsElements[i].dataset.cardId) {
        goodCardsElements[i].querySelector('.card-order__count').value = parseFloat(goodCardsElements[i].querySelector('.card-order__count').value) + 1;
        return false;
      }
    }
    return true;
  };

  var setTotalSumItems = function (elem) {
    return parseFloat(elem.querySelector('.card-order__price').textContent) * elem.querySelector('.card-order__count').value;
  };

  var setTotalGoodsAmount = function (element) {
    var goodsAmount = getGoodsAmount(element);
    var stringRight = getRightString(element);
    document.querySelector('.goods__total-count').firstChild.data = 'Итого за ' + goodsAmount + ' ' + stringRight + ':';
    document.querySelector('.main-header__basket').textContent = 'В корзине ' + goodsAmount + ' ' + stringRight;
  };

  // изначально корзина пуста, значит все поля блокируем
  changeBlockFields(document.querySelector('.order'), 'disabled', true);

  // поставил таймер, т.к. без него коллекция элементов еще пуста,
  // а после, например, максимального времени ожидания, можно
  // найти коллекцию загруженных элементов
  setTimeout(function () {
    var catalogCardElements = document.querySelectorAll('.catalog__card');
    for (var i = 0; i < catalogCardElements.length; i++) {
      catalogCardElements[i].addEventListener('click', function (evt) {
        evt.preventDefault();
        var target = evt.target;
        var currentTarget = evt.currentTarget;

        if (window.util.checkIsClickFeature(target, 'card__btn-favorite')) {
          changeFeatureForGood(target, 'card__btn-favorite--selected', 'card__btn-favorite');
        }
        if (window.util.checkIsClickFeature(target, 'card__btn-composition')) {
          changeFeatureForGood(currentTarget.querySelector('.card__composition'), 'card__composition--hidden', 'card__btn-composition');
        }

        if (!target.classList.contains('card__btn')) {
          return;
        }

        var goodCard = {
          img: currentTarget.querySelector('.card__img').src,
          price: currentTarget.querySelector('.card__price').firstChild.data,
          name: currentTarget.querySelector('.card__title').textContent,
          id: currentTarget.dataset.id
        };

        if (setGoodsAmountInBasket(target, currentTarget)) {
          goodCardsElement.appendChild(renderGoodCard(goodCard));
          // в параметрах не использую переменную потому что на момент, когда товар добавляю в корзину его еще нет.
          // А поиск коллекции прямо в параметре дает правильный результат
          document.querySelector('.goods__total-count').firstChild.data = 'Итого за ' + getGoodsAmountInBasket(goodCardsElement.querySelectorAll('article')) + ' ' + getRightString(goodCardsElement.querySelectorAll('article')) + ':';
        }

        if (!changeTextForBasket(window.util.checkIsEmptyBasket(goodCardsElement))) {
          document.querySelector('.goods__price').textContent = parseFloat(document.querySelector('.goods__price').textContent) + getSumElement(target, currentTarget) + ' ₽';
          document.querySelector('.main-header__basket').textContent = 'В корзине ' + getGoodsAmountInBasket(goodCardsElement.querySelectorAll('article')) + ' ' + getRightString(goodCardsElement.querySelectorAll('article'));
        }
      });
    }
  }, 1100);

  goodCardsElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var currentTarget = evt.currentTarget;

    if (target.tagName === 'A' && target.classList.contains('card-order__close')) {
      target.parentNode.remove();
      var parentTarget = findParentElement(target, currentTarget, 'ARTICLE');
      goodsPriceElement.textContent = parseFloat(goodsPriceElement.textContent) - setTotalSumItems(parentTarget) + ' ₽';
      setTotalGoodsAmount(goodCardsElement.querySelectorAll('article'));
    }

    if (target.tagName === 'BUTTON' && window.util.checkIsClickFeature(target, 'card-order__btn--increase')) {
      changeGoodAmount(target, currentTarget, 1);
    } else if (target.tagName === 'BUTTON' && window.util.checkIsClickFeature(target, 'card-order__btn--decrease')) {
      changeGoodAmount(target, currentTarget, -1);
    }

    if (!changeTextForBasket(window.util.checkIsEmptyBasket(goodCardsElement))) {
      setTotalGoodsAmount(goodCardsElement.querySelectorAll('article'));
    } else {
      document.querySelector('.main-header__basket').textContent = 'В корзине ничего нет';
    }
  });

  var resetInputs = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].value = '';
    }
  };

  var onload = function (response) {
    resetInputs(formElement.querySelectorAll('input'));
    document.querySelector('.modal--success').classList.remove('modal--hidden');
  };

  formElement.addEventListener('submit', function (evt) {
    window.upload(new FormData(formElement), onload, window.util.onError);
    evt.preventDefault();
  });

  document.addEventListener('click', function (evt) {
    var target = evt.target;
    var currentTarget = evt.currentTarget;

    var element = target.closest('.modal__close');

    if (!element) {
      return;
    }
    var parentElement = findParentElement(target, currentTarget, 'SECTION');
    parentElement.classList.add('modal--hidden');
  });
})();
