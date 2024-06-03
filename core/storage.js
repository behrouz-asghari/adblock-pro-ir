// core/storage.js
const Storage = (() => {
  'use strict';

  function get(keys) {
    if (typeof keys === 'string') keys = [keys];
    return new Promise(function (resolve) {
      chrome.storage.local.get(keys, resolve);
    });
  }

  function set(data) {
    return new Promise(function (resolve) {
      chrome.storage.local.set(data, resolve);
    });
  }

  return {
    get: get,
    set: set,

    initialize: function () {
      return get(Object.keys(DEFAULTS)).then(function (data) {
        const missing = {};
        Object.keys(DEFAULTS).forEach(function (key) {
          if (data[key] === undefined) missing[key] = DEFAULTS[key];
        });
        if (Object.keys(missing).length) return set(missing);
      });
    },

    getAll: function () {
      return get(Object.keys(DEFAULTS));
    },

    onChange: function (callback) {
      chrome.storage.onChanged.addListener(function (changes, area) {
        if (area === 'local') callback(changes);
      });
    }
  };
})();
