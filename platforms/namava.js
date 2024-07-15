// platforms/namava.js
var NamavaPlatform = (function () {
  'use strict';

  function NamavaPlatform() {
    BasePlatform.call(this, { name: 'namava', hostname: 'namava.ir' });
    this._adPollTimer = null;
  }

  NamavaPlatform.prototype = Object.create(BasePlatform.prototype);
  NamavaPlatform.prototype.constructor = NamavaPlatform;

  NamavaPlatform.prototype.isAdVideo = function (video) {
    var src = video.getAttribute('src') || '';
    if (!src || src.indexOf('blob:') === 0) return false;
    return /namava\.(ir|com)/i.test(src);
  };

  NamavaPlatform.prototype._stopAdPoll = function () {
    if (this._adPollTimer) {
      clearInterval(this._adPollTimer);
      this._adPollTimer = null;
    }
  };

  NamavaPlatform.prototype._seekToEnd = function (video) {
    var dur = video.duration;
    if (!dur || !isFinite(dur)) {
      console.log('[Namava] duration not ready:', dur);
      return false;
    }

    console.log('[Namava] skipping ad, duration:', dur);
    video.dataset.adblockSkipped = '1';
    video.currentTime = dur;

    // dispatch ended event تا player بفهمه تبلیغ تموم شده
    try {
      video.dispatchEvent(new Event('ended', { bubbles: false }));
    } catch (e) { }

    // اگه دکمه skip فعال بود، کلیک هم بزن (fallback)
    var skipBtn = document.querySelector(SELECTORS.NAMAVA.SKIP_BUTTON);
    if (!skipBtn) {
      // دکمه هنوز activeButton نگرفته، از SKIP_AREA استفاده کن
      skipBtn = document.querySelector(SELECTORS.NAMAVA.SKIP_AREA);
    }
    if (skipBtn) {
      console.log('[Namava] clicking skip button');
      skipBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      skipBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      skipBtn.click();
    }

    this._stopAdPoll();
    this._reportSkip();
    return true;
  };

  NamavaPlatform.prototype.checkVideoAd = function () {
    var self = this;
    var videos = document.querySelectorAll(SELECTORS.NAMAVA.VIDEO);

    console.log('[Namava] videos found:', videos.length);

    var adVideo = null;
    for (let i = 0; i < videos.length; i++) {
      var v = videos[i];
      console.log('[Namava] src:', v.getAttribute('src'), '| isAd:', self.isAdVideo(v));
      if (self.isAdVideo(v) && !v.dataset.adblockSkipped) {
        adVideo = v;
        break;
      }
    }

    if (!adVideo) return;
    if (self._adPollTimer) return;

    if (self._seekToEnd(adVideo)) return;

    self._adPollTimer = setInterval(function () {
      var vids = document.querySelectorAll(SELECTORS.NAMAVA.VIDEO);
      var currentAd = null;
      for (var j = 0; j < vids.length; j++) {
        if (self.isAdVideo(vids[j]) && !vids[j].dataset.adblockSkipped) {
          currentAd = vids[j];
          break;
        }
      }

      if (!currentAd) {
        console.log('[Namava] ad gone, stopping poll');
        self._stopAdPoll();
        return;
      }

      self._seekToEnd(currentAd);
    }, 300);
  };

  return NamavaPlatform;
})();
