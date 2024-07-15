// platforms/rubika.js
var RubikaPlatform = (function () {
  'use strict';

  function RubikaPlatform() {
    BasePlatform.call(this, {
      name:     'rubika',
      hostname: 'rubika.ir'
    });
    this._pendingSkips = new WeakSet();
  }

  RubikaPlatform.prototype = Object.create(BasePlatform.prototype);
  RubikaPlatform.prototype.constructor = RubikaPlatform;

  RubikaPlatform.prototype.isMatch = function () {
    return window.location.hostname.indexOf('rubika.ir') !== -1;
  };

  RubikaPlatform.prototype.isAdVideo = function (video) {
    var src = video.currentSrc || video.src || video.getAttribute('src') || '';
    if (!src || src.startsWith('blob:')) return false;
    return true;
  };

  RubikaPlatform.prototype._doSkip = function (video) {
    try {
      var dur = video.duration;
      if (!dur || !isFinite(dur) || dur <= 0) return false;

      video.currentTime = dur;
      video.dispatchEvent(new Event('timeupdate', { bubbles: true }));
      video.dispatchEvent(new Event('ended',      { bubbles: true }));

      video.dataset.adblockSkipped = '1';
      this._reportSkip('seek-to-end');
      Logger.info('[Rubika] Ad skipped, duration was:', dur);
      return true;
    } catch (e) {
      Logger.error('RubikaPlatform._doSkip:', e);
      return false;
    }
  };

  RubikaPlatform.prototype._scheduleSkip = function (video) {
    var self = this;

    if (this._pendingSkips.has(video)) return;
    this._pendingSkips.add(video);

    if (video.duration && isFinite(video.duration) && video.duration > 0) {
      this._doSkip(video);
      return;
    }

    function onMetadata() {
      video.removeEventListener('loadedmetadata', onMetadata);
      self._doSkip(video);
    }

    video.addEventListener('loadedmetadata', onMetadata);

    setTimeout(function () {
      video.removeEventListener('loadedmetadata', onMetadata);
      if (!video.dataset.adblockSkipped) {
        Logger.warn('[Rubika] Metadata timeout, forcing skip attempt');
        self._doSkip(video);
      }
    }, 5000);
  };

  RubikaPlatform.prototype.checkVideoAd = function () {
    var self   = this;
    var videos = document.querySelectorAll(
      (SELECTORS.RUBIKA && SELECTORS.RUBIKA.VIDEO) || 'video'
    );

    videos.forEach(function (video) {
      if (video.dataset.adblockSkipped) return;
      if (!self.isAdVideo(video))       return;
      if (video.ended)                  return;

      self._scheduleSkip(video);
    });
  };

  RubikaPlatform.prototype.applyBannerStyles = function () {};

  return RubikaPlatform;
})();
