// platforms/sheyda.js
var SheydaPlatform = (function () {
  'use strict';

  function SheydaPlatform() {
    BasePlatform.call(this, { name: 'sheyda', hostname: 'sheyda.com' });
  }

  SheydaPlatform.prototype = Object.create(BasePlatform.prototype);
  SheydaPlatform.prototype.constructor = SheydaPlatform;


  return SheydaPlatform;
})();
