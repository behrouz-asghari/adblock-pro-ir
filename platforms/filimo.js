// platforms/filimo.js
var FilimoPlatform = (function () {
  'use strict';

  function FilimoPlatform() {
    BasePlatform.call(this, { name: 'filimo', hostname: 'filimo.com' });
  }

  FilimoPlatform.prototype = Object.create(BasePlatform.prototype);
  FilimoPlatform.prototype.constructor = FilimoPlatform;

  FilimoPlatform.prototype.applyBannerStyles = function () {
    this._injectStyle(
      SELECTORS.FILIMO.BANNER.join(',\n') + ' { display: none !important; }'
    );
  };

  FilimoPlatform.prototype.checkVideoAd = function () {
    var self   = this;
    var videos = document.querySelectorAll(SELECTORS.FILIMO.VIDEO);

    for (var i = 0; i < videos.length; i++) {
      var video = videos[i];
      if (!self.isAdVideo(video)) continue;

      if (self._trySkipButton(video)) return;
      self.skipVideo(video);
      return;
    }
  };

  FilimoPlatform.prototype._trySkipButton = function (video) {
    if (!this.settings.skipVideoAds) return false;
    var btn = document.querySelector(SELECTORS.FILIMO.SKIP_BUTTON);
    if (btn && !btn.disabled) {
      btn.click();
      if (!video.dataset.adblockSkipped) {
        video.dataset.adblockSkipped = '1';
        this._reportSkip('skip-button');
      }
      return true;
    }
    return false;
  };

  return FilimoPlatform;
})();
