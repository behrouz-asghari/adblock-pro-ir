// core/constants.js
const STORAGE_KEYS = {
  EXTENSION_ENABLED: 'extensionEnabled',
  SKIP_VIDEO_ADS: 'skipVideoAds',
  HIDE_BANNER_ADS: 'hideBannerAds',
  SKIPPED_ADS_COUNT: 'skippedAdsCount'
};

const DEFAULTS = {
  extensionEnabled: true,
  skipVideoAds: true,
  hideBannerAds: true,
  skippedAdsCount: 0
};

const AD_PATTERNS = {
  VIDEO: [
    'sabavision',
    '/ads/',
    'vast',
    'preroll',
    'aparat-ads',
    'ads.cdn',
    'adserver',
    'advertisement',
    'res.'
  ],
  BANNER_DOMAINS: [
    'yektanet.com',
    'tapsell.com',
    'kaprila.com',
    'mediaad.org',
    'adexo.ir',
    'tavoos.net',
    'sabavision.com'
  ]
};

const SELECTORS = {
  GLOBAL: [
    'section.ads',
    'div.ads',
    '.side-ads',
    '.under-video-ad',
    '.dsp-ad',
    '#underVideoSyncV2',
    '[class*="advertisement"]',
    '[class*="banner-ad"]',
    '[class*="ad-banner"]',
    '[class*="ads-container"]',
    '[class*="ad-container"]',
    '[class*="adsbygoogle"]',
    'ins.adsbygoogle',
    '[data-ad-slot]',
    '[data-ad-unit]',
    'iframe[src*="yektanet"]',
    'iframe[src*="tapsell"]',
    'iframe[src*="kaprila"]',
    'iframe[src*="sabavision"]',
    'iframe[src*="mediaad"]',
    'iframe[src*="adexo"]',
    'iframe[src*="tavoos"]',
    'iframe[src*="/ads/"]',
    'iframe[src*="/adv/"]',
    'img[src*="/ads/"]',
    'img[src*="/adv/"]',
    'img[src*="yektanet"]',
    'img[src*="tapsell"]',
    'a[href*="/redirect/ads/" i]',
    'a[href*="/ads/redirect/" i]'
  ],
  APARAT: {
    VIDEO: 'video',
    BANNER: [
      '.dsp-ad',
      '.side-ads',
      '.under-video-ad',
      '#underVideoSyncV2',
      'iframe[src*="sabavision"]',
      'iframe[src*="ad"]'
    ]
  },
  FILIMO: {
    VIDEO: 'video',
    SKIP_BUTTON: '[data-cy="skip-button"]',
    BANNER: [
      '[class*="banner-ad"]',
      '[class*="advertisement"]',
      'iframe[src*="ads"]'
    ]
  },
NAMAVA: {
  VIDEO: 'video',
  SKIP_BUTTON: '[class*="skipButton"][class*="activeButton"]',
  SKIP_AREA:   '[class*="skipButton"]',
},
RUBIKA: {
  VIDEO: 'video'
}

};

const INTERVALS = {
  AD_CHECK: 1500,
  BANNER_SCAN: 2000
};

const MSG = {
  GET_SETTINGS: 'GET_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  INCREMENT_COUNTER: 'INCREMENT_COUNTER',
  RESET_COUNTER: 'RESET_COUNTER'
};
