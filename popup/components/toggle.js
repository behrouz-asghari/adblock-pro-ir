// popup/components/toggle.js
var ToggleComponent = (function () {
  'use strict';

  var UI = {};

  function init() {
    UI.extensionEnabled = document.getElementById('extensionEnabled');
    UI.skipVideoAds     = document.getElementById('skipVideoAds');
    UI.hideBannerAds    = document.getElementById('hideBannerAds');
    UI.statusBadge      = document.getElementById('statusBadge');
    UI.settingsCard     = document.getElementById('settingsCard');

    UI.extensionEnabled.addEventListener('change', function () {
      var val = UI.extensionEnabled.checked;
      save(STORAGE_KEYS.EXTENSION_ENABLED, val);
      updateUI(val);
      Messaging.updateSettings({ extensionEnabled: val });
    });

    UI.skipVideoAds.addEventListener('change', function () {
      save(STORAGE_KEYS.SKIP_VIDEO_ADS, UI.skipVideoAds.checked);
    });

    UI.hideBannerAds.addEventListener('change', function () {
      save(STORAGE_KEYS.HIDE_BANNER_ADS, UI.hideBannerAds.checked);
    });
  }

  function save(key, value) {
    var data = {};
    data[key] = value;
    return Storage.set(data);
  }

  function load() {
    return Storage.getAll().then(function (data) {
      var enabled   = data[STORAGE_KEYS.EXTENSION_ENABLED] !== false;
      var skipVideo = data[STORAGE_KEYS.SKIP_VIDEO_ADS]    !== false;
      var hideBanner= data[STORAGE_KEYS.HIDE_BANNER_ADS]   !== false;

      UI.extensionEnabled.checked = enabled;
      UI.skipVideoAds.checked     = skipVideo;
      UI.hideBannerAds.checked    = hideBanner;

      updateUI(enabled);
    });
  }

  function updateUI(enabled) {
    if (UI.statusBadge) {
      UI.statusBadge.textContent  = enabled ? 'فعال' : 'غیرفعال';
      UI.statusBadge.className    = 'badge ' + (enabled ? 'badge-active' : 'badge-inactive');
    }
    if (UI.settingsCard) {
      UI.settingsCard.style.opacity      = enabled ? '1' : '0.5';
      UI.settingsCard.style.pointerEvents= enabled ? 'auto' : 'none';
    }
  }

  return { init: init, load: load };
})();
