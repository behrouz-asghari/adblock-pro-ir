// background.js
(function () {
  'use strict';

  // ─── helpers ───────────────────────────────────────────
  function storageGet(keys) {
    return new Promise(function (resolve) {
      chrome.storage.local.get(keys, resolve);
    });
  }

  function storageSet(data) {
    return new Promise(function (resolve) {
      chrome.storage.local.set(data, resolve);
    });
  }

  function log() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[BG]');
    console.log.apply(console, args);
  }

  // ─── declarativeNetRequest ──────────────────────────────
  function applyRules(enabled) {
    var update = enabled
      ? { enableRulesetIds:  ['ruleset_1'], disableRulesetIds: [] }
      : { disableRulesetIds: ['ruleset_1'], enableRulesetIds:  [] };

    return chrome.declarativeNetRequest
      .updateEnabledRulesets(update)
      .then(function ()  { log('Rules', enabled ? 'enabled' : 'disabled'); })
      .catch(function (e){ console.error('[BG] Rules error:', e); });
  }

  // ─── init ───────────────────────────────────────────────
  function initialize() {
    return storageGet(Object.keys(DEFAULTS_BG)).then(function (data) {
      var missing = {};
      Object.keys(DEFAULTS_BG).forEach(function (k) {
        if (data[k] === undefined) missing[k] = DEFAULTS_BG[k];
      });
      if (Object.keys(missing).length) return storageSet(missing);
    });
  }

  var DEFAULTS_BG = {
    extensionEnabled: true,
    skipVideoAds:     true,
    hideBannerAds:    true,
    skippedAdsCount:  0
  };

  var MSG = {
    GET_SETTINGS:      'GET_SETTINGS',
    UPDATE_SETTINGS:   'UPDATE_SETTINGS',
    INCREMENT_COUNTER: 'INCREMENT_COUNTER',
    RESET_COUNTER:     'RESET_COUNTER'
  };

  // ─── message handler ────────────────────────────────────
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    (function () {
      var type = message.type;

      if (type === MSG.GET_SETTINGS) {
        storageGet(Object.keys(DEFAULTS_BG)).then(function (data) {
          var settings = {};
          Object.keys(DEFAULTS_BG).forEach(function (k) {
            settings[k] = data[k] !== undefined ? data[k] : DEFAULTS_BG[k];
          });
          sendResponse({ success: true, settings: settings });
        });

      } else if (type === MSG.UPDATE_SETTINGS) {
        storageSet(message.settings).then(function () {
          var enabled = message.settings.extensionEnabled;
          if (enabled !== undefined) return applyRules(enabled);
        }).then(function () {
          sendResponse({ success: true });
        });

      } else if (type === MSG.INCREMENT_COUNTER) {
        storageGet(['skippedAdsCount']).then(function (data) {
          var next = (data.skippedAdsCount || 0) + 1;
          return storageSet({ skippedAdsCount: next }).then(function () {
            sendResponse({ success: true, counter: next });
          });
        });

      } else if (type === MSG.RESET_COUNTER) {
        storageSet({ skippedAdsCount: 0 }).then(function () {
          sendResponse({ success: true, counter: 0 });
        });

      } else {
        sendResponse({ success: false, error: 'Unknown type' });
      }
    })();

    return true; // async response
  });

  // ─── lifecycle ──────────────────────────────────────────
  chrome.runtime.onInstalled.addListener(function () {
    log('Installed');
    initialize().then(function () {
      return storageGet(['extensionEnabled']);
    }).then(function (data) {
      return applyRules(data.extensionEnabled !== false);
    });
  });

  chrome.runtime.onStartup.addListener(function () {
    log('Startup');
    storageGet(['extensionEnabled']).then(function (data) {
      return applyRules(data.extensionEnabled !== false);
    });
  });

  log('Background loaded');
})();
