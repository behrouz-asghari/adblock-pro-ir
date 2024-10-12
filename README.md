# AdBlock Pro IR

<div dir="rtl">

**حذف تبلیغات ویدئویی و بنری در آپارات، فیلیمو و سایت‌های ایرانی**

</div>

A lightweight, privacy-focused browser extension that blocks video and banner ads on popular Iranian platforms using Manifest V3.

---

## 🎯 Features

- **Video Ad Skipping** — Automatically detects and skips video ads
- **Banner Ad Hiding** — Removes banner ads and promotional content via CSS injection
- **Network-Level Blocking** — Blocks ad domains at the request level using `declarativeNetRequest`
- **Platform-Specific Modules** — Tailored handlers for each supported site
- **Popup Controls** — Enable/disable extension, toggle video/banner blocking
- **Ad Counter** — Tracks the number of skipped ads with reset option
- **Zero Telemetry** — No data collection, tracking, or external requests

---

## 🌐 Supported Platforms

| Platform       | Video Ads | Banner Ads | Domain           |
|----------------|-----------|------------|------------------|
| **Aparat**     | ✅        | ✅         | `aparat.com`     |
| **Filimo**     | ✅        | ✅         | `filimo.com`     |
| **Namava**     | ✅        | ✅         | `namava.ir`      |
| **Telewebion** | ✅        | ✅         | `telewebion.com` |
| **Sheyda**     | ✅        | ✅         | `sheydatv.com`   |
| **Rubika**     | ✅        | ✅         | `rubika.ir`      |
| **Cafebazaar** | ✅        | ✅         | `cafebazaar.ir`  |
| **Myket**      | ✅        | ✅         | `myket.ir`       |
| **TMK**        | ✅        | ✅         | `tmkstore.ir`    |

### Blocked Ad Networks

- `yektanet.com`
- `tapsell.com`
- `kaprila.com`
- `mediaad.org`
- `adexo.ir`
- `tavoos.net`
- `sabavision.com`

---

## 📦 Installation (Developer Mode)

### Chrome / Edge / Brave

1. Clone or download this repository:

```bash
git clone https://github.com/YourUsername/adblock-pro-ir.git
```

2. Open your browser and navigate to:
   - **Chrome:** `chrome://extensions/`
   - **Edge:** `edge://extensions/`
   - **Brave:** `brave://extensions/`

3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the `adblock-pro-ir` folder.
5. The extension icon will appear in your toolbar.

---

## 🚀 Usage

1. Click the extension icon to open the popup.
2. Toggle the main switch to enable/disable the extension.
3. Enable **Skip Video Ads** and **Hide Banner Ads** as needed.
4. The counter shows how many ads have been blocked.
5. Click **Reset** to clear the counter.

---

## 📁 Project Structure

```text
adblock-pro/
├── manifest.json           # Extension configuration (Manifest V3)
├── background.js           # Service worker - manages state & rules
├── content.js              # Main content script - initializes platforms
├── core/
│   ├── constants.js        # Shared constants
│   ├── domUtils.js         # DOM manipulation helpers
│   └── storage.js          # chrome.storage wrapper
├── platforms/
│   ├── base.js             # Base platform class
│   ├── global.js           # Global ad blocker (runs on all sites)
│   ├── aparat.js           # Aparat-specific handler
│   ├── filimo.js           # Filimo-specific handler
│   ├── namava.js           # Namava-specific handler
│   ├── telewebion.js       # Telewebion-specific handler
│   ├── sheyda.js           # Sheyda-specific handler
│   ├── rubika.js           # Rubika-specific handler
│   ├── cafebazaar.js       # Cafebazaar-specific handler
│   ├── myket.js            # Myket-specific handler
│   └── tmk.js              # TMK-specific handler
├── popup/
│   ├── popup.html          # Popup UI
│   ├── popup.js            # Popup controller
│   ├── popup.css           # Popup styles
│   └── components/
│       ├── toggle.js       # Toggle switches component
│       └── stats.js        # Statistics display component
├── rules/
│   └── rules.json          # declarativeNetRequest blocking rules
├── styles/
│   └── injected/
│       ├── global.css      # Global ad-hiding styles
│       ├── aparat.css      # Aparat-specific styles
│       └── filimo.css      # Filimo-specific styles
└── utils/
    ├── logger.js           # Console logging utility
    └── messaging.js        # Chrome messaging helpers
```

---

## ⚙️ How It Works

### 1. Network-Level Blocking

The extension uses Chrome's `declarativeNetRequest` API to block ad domains before they load:

- Rules are defined in `rules/rules.json`
- Blocks requests to known ad networks (Yektanet, Tapsell, etc.)
- No performance overhead — handled by the browser engine

### 2. Content Scripts

When you visit a supported site:

- `content.js` initializes the appropriate platform handler
- Each platform module extends `BasePlatform` with site-specific logic
- Uses `MutationObserver` to detect dynamically injected ads

### 3. Platform Handlers

Each platform file (e.g. `aparat.js`) defines:

- **Video ad detection** — Identifies ad containers and video players
- **Skip logic** — Clicks skip buttons or manipulates playback
- **Banner removal** — Hides promotional elements via CSS

### 4. Background Service Worker

`background.js` manages:

- Extension state (enabled/disabled)
- Feature toggles (video/banner blocking)
- Ad counter persistence
- Dynamic rule updates

---

## 🔒 Permissions

| Permission              | Usage                                 |
|-------------------------|---------------------------------------|
| `storage`               | Save settings and ad counter          |
| `declarativeNetRequest` | Block ad domains at the network level |
| `tabs`                  | Detect active platform and send messages |
| Host permissions        | Run content scripts on supported Iranian platforms |

---

## 🛠️ Development

### Prerequisites

- Chrome/Chromium-based browser
- Basic knowledge of JavaScript and Chrome Extensions API

### Local Setup

```bash
# Clone the repository
git clone https://github.com/YourUsername/adblock-pro-ir.git
cd adblock-pro-ir

# Load unpacked extension (see Installation section)
```

### Making Changes

1. Edit files in `platforms/` to modify platform-specific behavior.
2. Update `rules/rules.json` to add/remove blocked domains.
3. Modify `popup/` files to change the UI.
4. Reload the extension in `chrome://extensions/` to test changes.

### Adding a New Platform

1. Create `platforms/yourplatform.js`:

```javascript
import BasePlatform from './base.js';

export default class YourPlatform extends BasePlatform {
  constructor() {
    super('yourplatform.com');
  }

  skipVideoAd() {
    // Your ad-skipping logic
  }

  hideBannerAd() {
    // Your banner-hiding logic
  }
}
```

2. Import and initialize it in `content.js`:

```javascript
import YourPlatform from './platforms/yourplatform.js';
new YourPlatform();
```

3. Add host permission in `manifest.json`:

```json
"host_permissions": [
  "*://*.yourplatform.com/*"
]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feat/new-platform
```

3. Commit your changes:

```bash
git commit -m "feat: add support for NewPlatform"
```

4. Push to your fork:

```bash
git push origin feat/new-platform
```

5. Open a Pull Request.

### Commit Convention

Use Conventional Commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code restructuring
- `docs:` — Documentation changes
- `style:` — CSS/formatting changes

---

## 📄 License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

## ⚠️ Disclaimer

This extension is provided for educational and personal use only. It is designed to improve user experience by removing intrusive ads. The developers are not responsible for any misuse or violation of terms of service of the supported platforms.

---

## 🙏 Acknowledgments

- Inspired by the need for a privacy-focused ad blocker tailored to Iranian platforms
- Built with Chrome’s Manifest V3 for enhanced security and performance
- Thanks to the open-source community for tools and libraries

---

## 📞 Support

If you encounter issues or have suggestions:

- Open an issue on **GitHub Issues**
- Check existing issues before creating a new one
- Provide detailed reproduction steps for bugs

---

Made with ❤️ for a cleaner web experience.
