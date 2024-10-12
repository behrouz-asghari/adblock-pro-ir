// utils/messaging.js
var Messaging = (function () {
  'use strict';

  function send(type, extra) {
    var payload = { type: type };
    if (extra) {
      Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });
    }
    return new Promise(function (resolve, reject) {
      chrome.runtime.sendMessage(payload, function (response) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  return {
    getSettings:      function ()        { return send(MSG.GET_SETTINGS); },
    updateSettings:   function (s)       { return send(MSG.UPDATE_SETTINGS, { settings: s }); },
    incrementCounter: function ()        { return send(MSG.INCREMENT_COUNTER); },
    resetCounter:     function ()        { return send(MSG.RESET_COUNTER); }
  };
})();
