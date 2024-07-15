// platforms/aparat.js
var AparatPlatform = (function () {
  'use strict';

  function AparatPlatform() {
    BasePlatform.call(this, { name: 'aparat', hostname: 'aparat.com' });
  }

  AparatPlatform.prototype = Object.create(BasePlatform.prototype);
  AparatPlatform.prototype.constructor = AparatPlatform;

  AparatPlatform.prototype.applyBannerStyles = function () {
    this._injectStyle(
      SELECTORS.APARAT.BANNER.join(',\n') + ' { display: none !important; }'
    );
  };

AparatPlatform.prototype.checkVideoAd = function () {
  var self  = this;
  var video = document.querySelector(SELECTORS.APARAT.VIDEO);
  if (!video) return;

  if (!video.dataset.originalSrc && video.getAttribute('src')) {
    video.dataset.originalSrc = video.getAttribute('src');
  }
  self.skipVideo(video);
};

  return AparatPlatform;
})();
