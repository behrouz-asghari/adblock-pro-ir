// core/domUtils.js

const DomUtils = (() => {

  return {
    injectStyle(id, css) {
      if (document.getElementById(id)) return;

      const style = document.createElement("style");
      style.id = id;
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);

      Logger.info(`Style injected: ${id}`);
    },

    removeStyle(id) {
      const el = document.getElementById(id);
      if (el) {
        el.remove();
        Logger.info(`Style removed: ${id}`);
      }
    },

    async waitForElement(selector, timeout = 10000) {
      const existing = document.querySelector(selector);
      if (existing) return existing;

      return new Promise((resolve, reject) => {
        const observer = new MutationObserver(() => {
          const found = document.querySelector(selector);
          if (found) {
            observer.disconnect();
            resolve(found);
          }
        });

        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });

        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Timeout: ${selector}`));
        }, timeout);
      });
    },

    removeElements(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
      return elements.length;
    },

    hideElements(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
      return elements.length;
    },

    observeAndRemove(selectors, callback) {
      const observer = new MutationObserver(() => {
        selectors.forEach(selector => {
          const count = this.removeElements(selector);
          if (count > 0 && callback) callback(selector, count);
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return observer;
    }
  };
})();
