'use strict';

(function () {
  var emptyFiltersTemplate = document.querySelector('#empty-filters').content.querySelector('.catalog__empty-filter');

  var renderEmptyFilters = function () {
    var element = emptyFiltersTemplate.cloneNode(true);
    element.classList.add('visually-hidden');
    return element;
  };

  window.catalogEmpty = {
    render: renderEmptyFilters
  };
})();
