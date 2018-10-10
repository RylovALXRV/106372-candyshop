'use strict';

(function () {

  var getInput = function (field, i) {
    return field[i] ? field[i] : false;
  };

  var filterByKind = function (card, target, foodType) {
    if (target[0] === undefined) {
      return true;
    }
    return card['kind'] === foodType[getInput(target, 0).value] ||
      card['kind'] === foodType[getInput(target, 1).value] ||
      card['kind'] === foodType[getInput(target, 2).value] ||
      card['kind'] === foodType[getInput(target, 3).value] ||
      card['kind'] === foodType[getInput(target, 4).value];
  };

  window.filterKind = {
    filterByKind: filterByKind
  };
})();
