// content.js
(function () {
  'use strict';

  var platforms = [
    new GlobalPlatform(),
    new AparatPlatform(),
    new FilimoPlatform(),
    new NamavaPlatform(),
    new SheydaPlatform(),
    new TelewebionPlatform(),
    new CafebazaarPlatform(),
    new MyketPlatform(),
    new TmkPlatform(),
    new RubikaPlatform()
    ];

  var observer = null;

  function startPlatforms(settings) {
    platforms.forEach(function (p) {
      if (p.isActive()) p.start(settings);
    });
  }

  function stopPlatforms() {
    platforms.forEach(function (p) { p.stop(); });
  }

  function setupObserver(settings) {
    // MutationObserver برای SPA navigation
    if (observer) observer.disconnect();

    observer = new MutationObserver(function () {
      platforms.forEach(function (p) {
        if (p.isActive() && p.settings.extensionEnabled !== false) {
          if (p.settings.skipVideoAds) p.checkVideoAd();
        }
      });
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }


  function init() {
    Messaging.getSettings().then(function (response) {
      var settings = response && response.settings ? response.settings : {};
      Object.keys(DEFAULTS).forEach(function (k) {
        if (settings[k] === undefined) settings[k] = DEFAULTS[k];
      });

      if (!settings.extensionEnabled) {
        Logger.info('Extension disabled');
        return;
      }

      startPlatforms(settings);
      setupObserver(settings);
      Logger.info('AdBlock Pro active');
    }).catch(function (e) {
      Logger.error('Init failed:', e);
    });
  }

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== 'local') return;

    var newSettings = {};
    platforms.forEach(function (p) {
      Object.keys(p.settings).forEach(function (k) { newSettings[k] = p.settings[k]; });
    });
    Object.keys(changes).forEach(function (k) {
      newSettings[k] = changes[k].newValue;
    });

    if (newSettings.extensionEnabled === false) {
      stopPlatforms();
    } else {
      platforms.forEach(function (p) {
        if (p.isActive()) p.onSettingsChange(newSettings);
      });
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
