// popup/popup.js
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    Storage.initialize().then(function () {
      ToggleComponent.init();
      StatsComponent.init();

      return Promise.all([
        ToggleComponent.load(),
        StatsComponent.load()
      ]);
    }).catch(function (e) {
      console.error('[Popup] Init error:', e);
    });
  });
})();
