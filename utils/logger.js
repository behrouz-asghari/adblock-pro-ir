// utils/logger.js
const Logger = (function () {
  var PREFIX = '[AdBlock Pro]';
  var DEBUG   = false;

  return {
    info: function () {
      if (!DEBUG) return;
      var args = Array.prototype.slice.call(arguments);
      args.unshift(PREFIX);
      console.log.apply(console, args);
    },
    warn: function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(PREFIX);
      console.warn.apply(console, args);
    },
    error: function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(PREFIX);
      console.error.apply(console, args);
    },
    adSkipped: function (platform, method) {
      this.info('✓ Ad skipped on ' + platform + ' via ' + method);
    },
    platformDetected: function (name) {
      this.info('Platform: ' + name);
    }
  };
})();
