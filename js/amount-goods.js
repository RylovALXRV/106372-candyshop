// 'use strict';
//
// (function () {
//   var catalogCardsElement = document.querySelector('.catalog__cards');
//   var rangePriceMax = document.querySelector('.range__price--max');
//   var rangePriceMin = document.querySelector('.range__price--min');
//
//   var getMaxPrice = function (goods) {
//     var maxPrice = 0;
//     goods.forEach(function (good) {
//       if (maxPrice < good.price) {
//         maxPrice = good.price;
//       }
//     });
//     return maxPrice;
//   };
//
//   var getPrice = function (goods, width, coord) {
//     var priceMax = getMaxPrice(goods);
//     return Math.floor(coord * priceMax / (width - 10));
//   };
//
//   var setRangeCountField = function (goods, cards) {
//     document.querySelector('span.range__count').textContent = '(' + goods.length + ')';
//     var leftBtnStyle = parseFloat(getComputedStyle(document.querySelector('.range__btn--left')).left);
//     var rightBtnStyle = parseFloat(getComputedStyle(document.querySelector('.range__btn--right')).left);
//     var coords = document.querySelector('.range__filter').getBoundingClientRect().width;
//     rangePriceMin.textContent = getPrice(cards, coords, leftBtnStyle);
//     rangePriceMax.textContent = getPrice(cards, coords, rightBtnStyle);
//   };
//
//   var getAmountTypeGood = function (goods, foodType, key) {
//     var count = 0;
//     var countAmount = 0;
//     goods.forEach(function (good) {
//       if (good.amount > 0) {
//         countAmount++;
//       }
//       if (good.kind === foodType) {
//         count++;
//       }
//       if (good.nutritionFacts[key] === foodType) {
//         count++;
//       }
//     });
//     return count || countAmount;
//   };
//
//   var appendItemCount = function (goods) {
//     var amount = 0;
//     var inputs = document.querySelectorAll('.catalog__filter input');
//
//     for (var i = 0; i < inputs.length; i++) {
//       var parentElement = window.util.findParentElement(inputs[i], document, 'LI');
//       switch (inputs[i].id) {
//         case 'filter-icecream':
//           amount = getAmountTypeGood(goods, 'Мороженое');
//           break;
//         case 'filter-soda':
//           amount = getAmountTypeGood(goods, 'Газировка');
//           break;
//         case 'filter-gum':
//           amount = getAmountTypeGood(goods, 'Жевательная резинка');
//           break;
//         case 'filter-marmalade':
//           amount = getAmountTypeGood(goods, 'Мармелад');
//           break;
//         case 'filter-marshmallows':
//           amount = getAmountTypeGood(goods, 'Зефир');
//           break;
//         case 'filter-sugar-free':
//           amount = getAmountTypeGood(goods, false, 'sugar');
//           break;
//         case 'filter-vegetarian':
//           amount = getAmountTypeGood(goods, true, 'vegetarian');
//           break;
//         case 'filter-gluten-free':
//           amount = getAmountTypeGood(goods, false, 'gluten');
//           break;
//         case 'filter-availability':
//           amount = getAmountTypeGood(goods);
//           break;
//         default:
//           amount = 0;
//           break;
//       }
//       if (parentElement.querySelector('.input-btn__item-count')) {
//         parentElement.querySelector('.input-btn__item-count').textContent = '(' + amount + ')';
//       }
//     }
//   };
//
//   // не знаю как сделать, ведь товара сначала нет...
//   setTimeout(function () {
//     appendItemCount(window.catalog.cards());
//     setRangeCountField(catalogCardsElement.querySelectorAll('article'), window.catalog.cards());
//   }, 1500);
// })();
