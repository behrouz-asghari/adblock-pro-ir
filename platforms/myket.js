// platforms/myket.js
var MyketPlatform = (function () {
  'use strict';

  function MyketPlatform() {
    BasePlatform.call(this, { name: 'myket', hostname: 'myket.ir' });
  }

  MyketPlatform.prototype = Object.create(BasePlatform.prototype);
  MyketPlatform.prototype.constructor = MyketPlatform;


  return MyketPlatform;
})();
