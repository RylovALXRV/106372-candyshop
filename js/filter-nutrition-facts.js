'use strict';

(function () {

  var getInput = function (field, i) {
    return field[i] ? field[i] : false;
  };

  var filterByOneNutritionFacts = function (card, target, foodProperty) {
    if (target[0] === undefined) {
      return true;
    }
    return card['nutritionFacts'][foodProperty[getInput(target, 0).value][0]] === foodProperty[getInput(target, 0).value][1];
  };

  var filterByTwoNutritionFacts = function (card, target, foodProperty) {
    if (target[1] === undefined && target[2] === undefined) {
      return true;
    }
    return card['nutritionFacts'][foodProperty[getInput(target, 0).value][0]] === foodProperty[getInput(target, 0).value][1] &&
      card['nutritionFacts'][foodProperty[getInput(target, 1).value][0]] === foodProperty[getInput(target, 1).value][1];
  };

  var filterByThreeNutritionFacts = function (card, target, foodProperty) {
    if (target[1] === undefined || target[2] === undefined) {
      return true;
    }
    return card['nutritionFacts'][foodProperty[getInput(target, 0).value][0]] === foodProperty[getInput(target, 0).value][1] &&
      card['nutritionFacts'][foodProperty[getInput(target, 1).value][0]] === foodProperty[getInput(target, 1).value][1] &&
      card['nutritionFacts'][foodProperty[getInput(target, 2).value][0]] === foodProperty[getInput(target, 2).value][1];
  };

  window.filterNutritionFacts = {
    filterByOneNutritionFacts: filterByOneNutritionFacts,
    filterByTwoNutritionFacts: filterByTwoNutritionFacts,
    filterByThreeNutritionFacts: filterByThreeNutritionFacts
  };
})();
