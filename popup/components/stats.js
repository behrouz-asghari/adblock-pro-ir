// popup/components/stats.js
var StatsComponent = (function () {
  'use strict';

  var UI = {};

  function init() {
    UI.skippedCount = document.getElementById('skippedCount');
    UI.platformName = document.getElementById('platformName');
    UI.resetBtn = document.getElementById('resetStats');

    UI.resetBtn.addEventListener('click', handleReset);

    // real-time update
    Storage.onChange(function (changes) {
      if (changes[STORAGE_KEYS.SKIPPED_ADS_COUNT]) {
        updateCount(changes[STORAGE_KEYS.SKIPPED_ADS_COUNT].newValue || 0);
      }
    });
  }

  function load() {
    return Storage.getAll().then(function (data) {
      updateCount(data[STORAGE_KEYS.SKIPPED_ADS_COUNT] || 0);
      detectPlatform();
    });
  }

  function updateCount(n) {
    if (UI.skippedCount) UI.skippedCount.textContent = n;
  }

  function detectPlatform() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = (tabs[0] && tabs[0].url) || '';
      var name = '—';
      if (url.indexOf('aparat.com') !== -1) name = 'آپارات';
      else if (url.indexOf('filimo.com') !== -1) name = 'فیلیمو';
      else if (url.indexOf('namava.ir') !== -1) name = 'نماوا';
      else if (url.indexOf('sheyda.com') !== -1) name = 'شیدا';
      else if (url.indexOf('tmk.ir') !== -1) name = 'تماشاخونه';
      else if (url.indexOf('telewebion.ir') !== -1) name = 'تلوبیون';
      else if (url.indexOf('cafebazaar.ir/video') !== -1) name = 'کافه بازار';
      else if (url.indexOf('myket.ir/video') !== -1) name = 'مایکت';
      else if (url.indexOf('vod.rubika.ir') !== -1) name = 'روبیکا';
      if (UI.platformName) UI.platformName.textContent = name;
    });
  }

  function handleReset() {
    Messaging.resetCounter().then(function () {
      updateCount(0);
      UI.resetBtn.textContent = '✓ ریست شد';
      setTimeout(function () { UI.resetBtn.textContent = 'ریست آمار'; }, 1500);
    }).catch(function (e) { Logger.error('Reset failed:', e); });
  }

  return { init: init, load: load };
})();
