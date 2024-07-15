var CafebazaarPlatform = (function () {
  'use strict';

  function CafebazaarPlatform() {
    BasePlatform.call(this, {
      name: 'cafebazaar',
      hostname: 'cafebazaar.ir'
    });
    this._adPollTimer = null;
  }

  CafebazaarPlatform.prototype = Object.create(BasePlatform.prototype);
  CafebazaarPlatform.prototype.constructor = CafebazaarPlatform;

  CafebazaarPlatform.prototype.isAdVideo = function (video) {
    if (video.dataset.adblockSkipped) return false;
    var vjsEl = video.closest('video-js') || video.parentElement;
    if (!vjsEl) return false;
    return vjsEl.classList.contains('vjs-ad-playing');
  };

  CafebazaarPlatform.prototype._stopAdPoll = function () {
    if (this._adPollTimer) {
      clearInterval(this._adPollTimer);
      this._adPollTimer = null;
    }
  };

  CafebazaarPlatform.prototype._trySkipByTime = function (video) {
    var dur = video.duration;
    if (!dur || !isFinite(dur) || dur <= 0) return false;

    video.dataset.adblockSkipped = '1';
    video.currentTime = dur - 0.1;
    this._stopAdPoll();
    this._reportSkip('currentTime');
    return true;
  };

  CafebazaarPlatform.prototype.checkVideoAd = function () {
    var self = this;
    var video = document.querySelector('video.vjs-tech');

    if (!video || !self.isAdVideo(video)) {
      self._stopAdPoll();
      return;
    }

    if (self._adPollTimer) return;

    if (self._trySkipByTime(video)) return;

    self._adPollTimer = setInterval(function () {
      var v = document.querySelector('video.vjs-tech');
      if (!v || !self.isAdVideo(v)) {
        self._stopAdPoll();
        return;
      }
      self._trySkipByTime(v);
    }, 300);
  };

  return CafebazaarPlatform;
})();
