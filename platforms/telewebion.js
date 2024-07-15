var TelewebionPlatform = (function () {
  'use strict';

  function TelewebionPlatform() {
    BasePlatform.call(this, { name: 'telewebion', hostname: 'telewebion.ir' });
    this._adPollTimer = null;
  }

  TelewebionPlatform.prototype = Object.create(BasePlatform.prototype);
  TelewebionPlatform.prototype.constructor = TelewebionPlatform;

  TelewebionPlatform.prototype.isAdVideo = function (video) {
    if (video.dataset.adblockSkipped) return false;
    var player = document.getElementById('tw-player-container');
    if (!player) return false;
    return player.classList.contains('twp-ads-mode');
  };

  TelewebionPlatform.prototype._stopAdPoll = function () {
    if (this._adPollTimer) {
      clearInterval(this._adPollTimer);
      this._adPollTimer = null;
    }
  };

  TelewebionPlatform.prototype._tryClickSkip = function (video) {
    var btn = document.getElementById('twp-vast-skip');
    if (!btn) return false;

    if (btn.classList.contains('twp-vast-skip-progess-remaining')) return false;

    video.dataset.adblockSkipped = '1';
    btn.click();
    this._stopAdPoll();
    this._reportSkip('button-click');
    return true;
  };

  TelewebionPlatform.prototype._trySkipByTime = function (video) {
    var dur = video.duration;
    if (!dur || !isFinite(dur) || dur <= 0) return false;

    video.dataset.adblockSkipped = '1';
    video.currentTime = dur - 0.1;
    this._stopAdPoll();
    this._reportSkip('currentTime');
    return true;
  };

  TelewebionPlatform.prototype.checkVideoAd = function () {
    var self = this;
    var video = document.querySelector('#tw-player-container video#video');

    if (!video || !self.isAdVideo(video)) {
      self._stopAdPoll();
      return;
    }

    if (self._adPollTimer) return;

    if (self._tryClickSkip(video)) return;

    if (self._trySkipByTime(video)) return;

    self._adPollTimer = setInterval(function () {
      var v = document.querySelector('#tw-player-container video#video');
      if (!v || !self.isAdVideo(v)) {
        self._stopAdPoll();
        return;
      }
      // اول دکمه، بعد currentTime
      if (!self._tryClickSkip(v)) {
        self._trySkipByTime(v);
      }
    }, 300);
  };

  return TelewebionPlatform;
})();
