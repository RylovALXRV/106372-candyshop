'use strict';

(function () {
  var Url = {
    GET: 'https://js.dump.academy/candyshop/data',
    POST: 'https://js.dump.academy/candyshop'
  };

  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000;


  var createRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        document.querySelector('.catalog__load').classList.add('visually-hidden');
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  var download = function (onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('GET', Url.GET);
    xhr.send();
  };

  var upload = function (data, onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('GET', Url.GET);
    xhr.send(data);
  };

  window.backend = {
    load: download,
    upload: upload
  };
})();
