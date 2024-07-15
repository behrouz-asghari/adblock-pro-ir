// platforms/base.js
var BasePlatform = (function () {
  'use strict';

  function BasePlatform(config) {
    this.name      = config.name;
    this.hostname  = config.hostname;
    this.settings  = {};
    this._interval = null;
    this._styleId  = 'adblock-' + config.name;
  }

  BasePlatform.prototype.isActive = function () {
    if (!this.hostname) return true;
    return window.location.hostname.indexOf(this.hostname) !== -1;
  };

  BasePlatform.prototype.isEnabled = function () {
    return this.settings.extensionEnabled !== false;
  };

  BasePlatform.prototype.start = function (settings) {
    this.settings = settings;
    Logger.platformDetected(this.name);

    if (settings.hideBannerAds) this.applyBannerStyles();
    if (settings.skipVideoAds)  this._startVideoCheck();
  };

  BasePlatform.prototype.stop = function () {
    this._stopVideoCheck();
    var el = document.getElementById(this._styleId);
    if (el) el.remove();
  };

  BasePlatform.prototype.onSettingsChange = function (settings) {
    this.settings = settings;

    if (settings.hideBannerAds) {
      this.applyBannerStyles();
    } else {
      var el = document.getElementById(this._styleId);
      if (el) el.remove();
    }

    if (settings.skipVideoAds) {
      this._startVideoCheck();
    } else {
      this._stopVideoCheck();
    }
  };

  // override در subclass
  BasePlatform.prototype.applyBannerStyles = function () {};
  BasePlatform.prototype.checkVideoAd      = function () {};

  // ─── video skip helpers ─────────────────────────────────
BasePlatform.prototype.isAdVideo = function (video) {
  var src = [
    video.currentSrc,
    video.src,
    video.getAttribute('src'),
    video.dataset.originalSrc
  ].filter(Boolean).join(' ').toLowerCase();

  return AD_PATTERNS.VIDEO.some(function (p) {
    return src.indexOf(p) !== -1;
  });
};

  BasePlatform.prototype.skipVideo = function (video) {
    if (!this.settings.skipVideoAds) return false;
    if (!this.isAdVideo(video))       return false;
    if (video.dataset.adblockSkipped) return false;

    try {
      var dur = video.duration;
      if (dur && isFinite(dur) && dur > 1) {
        video.currentTime = dur - 0.1;
      } else {
        video.playbackRate = 16;
      }
      video.dataset.adblockSkipped = '1';
      this._reportSkip('video-seek');
      return true;
    } catch (e) {
      Logger.error('skipVideo error on ' + this.name + ':', e);
      return false;
    }
  };

  BasePlatform.prototype._reportSkip = function (method) {
    Logger.adSkipped(this.name, method);
    Messaging.incrementCounter().catch(function (e) {
      Logger.error('incrementCounter failed:', e);
    });
  };

  // ─── CSS inject helper ──────────────────────────────────
  BasePlatform.prototype._injectStyle = function (css) {
    if (document.getElementById(this._styleId)) return;
    var style = document.createElement('style');
    style.id          = this._styleId;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  };

  // ─── interval ───────────────────────────────────────────
  BasePlatform.prototype._startVideoCheck = function () {
    if (this._interval) return;
    var self = this;
    this._interval = setInterval(function () {
      if (self.settings.skipVideoAds) self.checkVideoAd();
    }, INTERVALS.AD_CHECK);
  };

  BasePlatform.prototype._stopVideoCheck = function () {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  };

  return BasePlatform;
})();
