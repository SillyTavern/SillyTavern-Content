# Message Collapser Extension for SillyTavern

**Version:** 1.1.0 (Code quality & accessibility improvements)
**Author:** Crystaria (with Xiao Zhua)
**License:** AGPL-3.0
**Compatibility:** SillyTavern 1.0+
**Scope:** Third-party extension

---

## 📖 Overview

Automatically collapse long messages in chat, keeping your interface clean. Supports customizable threshold and preview lines.

**Key Features:**
- ✅ Auto-collapse messages exceeding character threshold (default: 1000)
- ✅ One-click expand/collapse toggle
- ✅ Configurable message length threshold (100-5000 characters)
- ✅ Configurable preview lines (5-30 lines)
- ✅ Theme-aware styling (auto-adapts to light/dark themes)
- ✅ Persistent settings storage
- ✅ Accessibility support (ARIA attributes, focus states)
- ✅ Reduced motion support
- ✅ High contrast mode support
- ✅ Mobile responsive design

---

## 📦 Installation

### Third-party Extension Installation (Recommended)

1. **Download the extension package**
   ```bash
   unzip message-collapse-extension-v11.zip
   ```

2. **Copy to SillyTavern extensions directory**
   ```bash
   # Linux/Mac
   cp -r message-collapse-extension-v11 \
       /path/to/SillyTavern/public/scripts/extensions/third-party/message-collapse/

   # Windows (PowerShell)
   Copy-Item -Recurse message-collapse-extension-v11 \
       C:\Path\To\SillyTavern\public\scripts\extensions\third-party\message-collapse\
   ```

3. **Restart SillyTavern**

4. **Verify installation**
   - Open browser console (F12)
   - Look for: `[MessageCollapser] ✓ Extension loaded successfully`
   - No error messages should appear

---

## ⚙️ Configuration

After installation, find **Message Collapser Settings** in the SillyTavern extensions panel:

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| **Enable** | Enable/disable extension | ✅ Enabled | - |
| **Threshold** | Character count threshold for collapse | 1000 | 100-5000 |
| **Preview Lines** | Number of lines shown when collapsed | 10 | 5-30 |

**Remember to click "Save Settings" after modifying any values!**

---

## 🧪 Testing & Verification

### Test 1: Short Message (Should Not Collapse)
- Send a message with < 1000 characters
- **Expected:** Displayed normally, no collapse button

### Test 2: Long Message (Should Collapse)
- Send a message with > 1000 characters
- **Expected:** Auto-collapsed, shows "📄 Show more" button

### Test 3: Expand/Collapse Toggle
- Click "Show more" button
- **Expected:** Message fully expanded
- Click again
- **Expected:** Message re-collapsed

### Test 4: Settings Persistence
- Change threshold to 500
- Save settings
- Restart SillyTavern
- **Expected:** Settings persist and work correctly

### Test 5: Disable Extension
- Uncheck "Enable Message Collapser"
- Save settings
- Send long message
- **Expected:** Message displays without collapsing

---

## 📁 File Structure

```
message-collapse/
├── manifest.json          # Extension metadata
├── index.js               # Main logic (ES module)
├── style.css              # All styles (main + settings panel)
├── README.md              # This file
└── CHANGELOG.md           # Version history
```

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

## 🐛 Troubleshooting

### Extension Not Loading
1. Check console for `[MessageCollapser] ✓ Extension loaded successfully`
2. Verify folder location: `third-party/message-collapse/`
3. Restart SillyTavern server
4. Clear browser cache (Ctrl+Shift+R)

### Settings Panel Not Showing
1. Refresh browser (Ctrl+F5 for hard refresh)
2. Clear browser cache
3. Check console for error messages
4. Verify `extensions_settings` panel exists in DOM

### Messages Not Collapsing
1. Confirm extension is enabled (check Enable in settings panel)
2. Verify message length exceeds threshold (default: 1000 characters)
3. Check console for errors
4. Try changing threshold to a lower value (e.g., 100) to test

### Settings Not Saving
1. Click "Save Settings" button explicitly
2. Check for validation errors in status message
3. Verify browser storage permissions
4. Check `settings.json` file permissions on disk

---

## 🔒 Security & Privacy

- **No external API calls** - All processing is local
- **No data collection** - Settings stored locally in SillyTavern's `settings.json`
- **No telemetry** - No usage data is transmitted
- **Open source** - All code is visible and auditable

---

## 📄 License

This extension is licensed under **AGPL-3.0**.

---

## 🙏 Acknowledgments

Thanks to the SillyTavern team for providing an excellent platform and extension development guidelines!
