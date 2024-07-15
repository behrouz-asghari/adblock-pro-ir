// platforms/tmk.js
var TmkPlatform = (function () {
  'use strict';

  function TmkPlatform() {
    BasePlatform.call(this, { name: 'tmk', hostname: 'tmk.ir' });
  }

  TmkPlatform.prototype = Object.create(BasePlatform.prototype);
  TmkPlatform.prototype.constructor = TmkPlatform;


  return TmkPlatform;
})();
