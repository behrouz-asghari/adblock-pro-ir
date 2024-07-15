// platforms/global.js
var GlobalPlatform = (function () {
  'use strict';

  function GlobalPlatform() {
    BasePlatform.call(this, { name: 'global', hostname: null });
    this._observer = null;
    this._scanInterval = null;
  }

  GlobalPlatform.prototype = Object.create(BasePlatform.prototype);
  GlobalPlatform.prototype.constructor = GlobalPlatform;

  GlobalPlatform.prototype.applyBannerStyles = function () {
    var css = SELECTORS.GLOBAL.join(',\n') + ' { display: none !important; }';
    this._injectStyle(css);
    this._scanDOM();
    this._startObserver();
    this._startScanInterval();
  };

  GlobalPlatform.prototype._scanDOM = function () {
    if (!this.settings.hideBannerAds) return;
    var self = this;

    document.querySelectorAll('iframe, img').forEach(function (el) {
      if (el.dataset.adblockHidden) return;
      var src = el.src || el.getAttribute('src') || '';
      var blocked = AD_PATTERNS.BANNER_DOMAINS.some(function (d) {
        return src.indexOf(d) !== -1;
      });
      if (blocked) {
        el.dataset.adblockHidden = '1';
        el.style.setProperty('display', 'none', 'important');
      }
    });
  };

  GlobalPlatform.prototype._startObserver = function () {
    if (this._observer) return;
    var self = this;
    this._observer = new MutationObserver(function (mutations) {
      if (!self.settings.hideBannerAds) return;
      var hasNew = mutations.some(function (m) { return m.addedNodes.length > 0; });
      if (hasNew) self._scanDOM();
    });
    this._observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  GlobalPlatform.prototype._startScanInterval = function () {
    if (this._scanInterval) return;
    var self = this;
    this._scanInterval = setInterval(function () {
      if (self.settings.hideBannerAds) self._scanDOM();
    }, INTERVALS.BANNER_SCAN);
  };

  GlobalPlatform.prototype.stop = function () {
    BasePlatform.prototype.stop.call(this);
    if (this._observer)     { this._observer.disconnect(); this._observer = null; }
    if (this._scanInterval) { clearInterval(this._scanInterval); this._scanInterval = null; }
  };

  return GlobalPlatform;
})();
