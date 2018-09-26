'use strict';

(function () {
  var goodCardsElement = document.querySelector('.goods__cards');
  var paymentCardStatusElement = document.querySelector('.payment__card-status');

  var checkRightField = function (evt) {
    var sum = 0;

    switch (evt) {
      case (document.querySelector('#payment__card-number')):
        var targetValuesNumber = evt.value.split('');
        for (var i = 0; i < targetValuesNumber.length; i++) {
          var targetValueNumber = parseFloat(targetValuesNumber[i]);
          if (i % 2 === 0) {
            if (targetValueNumber * 2 >= 10) {
              sum += (targetValueNumber * 2) - 9;
            } else {
              sum += targetValueNumber * 2;
            }
          } else {
            sum += targetValueNumber;
          }
        }
        if (sum % 10 !== 0) {
          evt.setCustomValidity('введённый номер неверен');
        } else if (targetValuesNumber.length !== 16) {
          evt.setCustomValidity('номер карты должен состоять из 16 цифр.');
        } else {
          evt.setCustomValidity('');
          return true;
        }
        break;
      case (document.querySelector('#payment__card-date')):
        var targetValuesDate = evt.value.split('/');
        if (!targetValuesDate[0] || targetValuesDate[0].length !== 2 || !window.data.checkIsNumeric(targetValuesDate[0])) {
          evt.setCustomValidity('месяц не корректен');
        } else if (targetValuesDate[0] === '00' || targetValuesDate[0] > 12) {
          evt.setCustomValidity('месяц не корректен. Месяц должен быть в диапазоне от 01 до 12');
        } else if (!targetValuesDate[1] || targetValuesDate[1].length !== 2 || !window.data.checkIsNumeric(targetValuesDate[1])) {
          evt.setCustomValidity('год не корректен');
        } else {
          evt.setCustomValidity('');
          return true;
        }
        break;
      case (document.querySelector('#payment__card-cvc')):
        if (!window.data.checkIsNumeric(evt.value)) {
          evt.setCustomValidity('cvc не корректен. Он должен содержать только цифры');
        } else if (evt.value.length !== 3) {
          evt.setCustomValidity('cvc не корректен. Он должен содержать только 3 цифры');
        } else {
          evt.setCustomValidity('');
          return true;
        }
        break;
      case (document.querySelector('#payment__cardholder')):
        var targetCardHolder = evt.value.split(' ');
        if (!targetCardHolder[0] || !targetCardHolder[1]) {
          evt.setCustomValidity('Введены не все данные');
        } else {
          evt.setCustomValidity('');
          return true;
        }
        break;
    }
    return false;
  };

  var changeFields = function (target) {
    var selector = {
      'payment__cash-wrap': 'payment__card-wrap',
      'payment__card-wrap': 'payment__cash-wrap',
      'deliver__store': 'deliver__courier',
      'deliver__courier': 'deliver__store'
    };

    for (var key in selector) {
      if (~key.indexOf(target.htmlFor)) {
        document.querySelector('#' + target.htmlFor).checked = true;
        document.querySelector('.' + selector[key]).classList.add('visually-hidden');
        document.querySelector('.' + key).classList.remove('visually-hidden');
      }
    }
  };

  var setRequaredForInputs = function (elements, boolean) {
    for (var j = 0; j < elements.length; j++) {
      elements[j].required = boolean;
    }
  };

  var setFeatureForInputs = function (target) {
    var paymentInputs = document.querySelectorAll('.payment__inputs input');
    var deliverAddress = document.querySelectorAll('.deliver__address-entry-fields input');

    var fieldLabels = {
      'payment__card': [paymentInputs, true],
      'payment__cash': [paymentInputs, false],
      'deliver__courier': [deliverAddress, true],
      'deliver__store': [deliverAddress, false]
    };

    for (var key in fieldLabels) {
      if (target.htmlFor === key && window.data.checkIsEmptyBasket(goodCardsElement)) {
        setRequaredForInputs(fieldLabels[key][0], fieldLabels[key][1]);
      }
    }
  };

  document.querySelector('.payment').addEventListener('input', function (evt) {
    var target = evt.target;

    if (target.tagName !== 'INPUT') {
      return;
    }

    if (checkRightField(target)) {
      paymentCardStatusElement.textContent = 'Одобрен';
    } else {
      paymentCardStatusElement.textContent = 'Неизвестен';
    }
  });

  document.querySelector('.deliver__store-list').addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var currentTarget = evt.currentTarget;

    if (target.tagName !== 'LABEL') {
      return;
    }

    document.querySelector('.deliver__store-map-img').src = 'img/map/' + currentTarget.querySelector('#' + target.htmlFor).value + '.jpg';
    currentTarget.querySelector('#' + target.htmlFor).checked = true;
  });

  document.querySelector('.buy').addEventListener('click', function (evt) {
    var target = evt.target;

    changeFields(target);
    setFeatureForInputs(target);
  });
})();
