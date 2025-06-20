# Save to OmniFocus - Chrome Extension

A modern Chrome extension for quickly saving web pages and links to OmniFocus 4.

## Features

- **Quick Save**: Click the toolbar button to save the current page to OmniFocus
- **Context Menu**: Right-click any link to save it to OmniFocus
- **Selected Text**: Automatically captures any selected text along with the URL
- **Keyboard Shortcut**: Use `Cmd+Shift+O` (Mac) or `Ctrl+Shift+O` (Windows/Linux)
- **Customizable Templates**: Configure how tasks are formatted in OmniFocus
- **Modern Design**: Built with Manifest V3 for security and performance

## Installation

### From Source (Development)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your toolbar

## Usage

### Basic Usage

1. **Save Current Page**: Click the extension icon in the toolbar
2. **Save a Link**: Right-click any link and select "Save link to OmniFocus"
3. **Save with Selection**: Select text on the page before saving to include it in the task note
4. **Keyboard Shortcut**: Press `Cmd+Shift+O` (Mac) or `Ctrl+Shift+O` to quickly save

### Customizing Templates

1. Click the extension icon and select "Options" (or right-click → "Options")
2. Customize the task title and note templates using these variables:
   - `{title}` - The page title or link text
   - `{url}` - The page URL
   - `{selection}` - Any selected text

### Example Templates

**Read Later**:
- Title: `Read: {title}`
- Note: `{url}\n\n{selection}`

**Research**:
- Title: `Research: {title}`
- Note: `Source: {url}\n\nNotes: {selection}`

**Review**:
- Title: `Review: {title}`
- Note: `Link: {url}\n\nContext: {selection}`

## Requirements

- Google Chrome 88 or later
- OmniFocus 4 for Mac
- macOS (OmniFocus must be installed)

## How It Works

The extension uses OmniFocus's URL scheme (`omnifocus:///add`) to create tasks. When you save a page or link:

1. The extension captures the page information
2. Formats it according to your templates
3. Creates an OmniFocus URL with the task details
4. Triggers the URL to open OmniFocus's Quick Entry window

## Troubleshooting

### OmniFocus doesn't open
- Make sure OmniFocus 4 is installed on your Mac
- Check that OmniFocus is set as the default handler for `omnifocus://` URLs
- Try opening `omnifocus:///add?name=Test` directly in Chrome to test

### Extension doesn't appear
- Make sure Developer Mode is enabled in Chrome
- Try reloading the extension from `chrome://extensions/`
- Check the browser console for any errors

### Keyboard shortcut doesn't work
- The shortcut might conflict with another extension or system shortcut
- Go to `chrome://extensions/shortcuts` to customize it

## Privacy

This extension:
- Only accesses the active tab when you trigger it
- Stores your template preferences locally using Chrome's sync storage
- Does not collect or transmit any personal data
- Does not communicate with any external servers

## Development

### Project Structure
```
omnifocus-chrome-extension/
├── manifest.json          # Extension manifest (V3)
├── src/
│   ├── background.js      # Service worker
│   ├── options.html       # Options page
│   ├── options.js         # Options page logic
│   └── options.css        # Options page styles
├── images/
│   ├── icon.svg          # Source icon
│   ├── icon16.png        # Toolbar icon (16x16)
│   ├── icon48.png        # Toolbar icon (48x48)
│   └── icon128.png       # Store icon (128x128)
```

## License

This is an unofficial extension not affiliated with The Omni Group.

## Credits

Inspired by the original "Send to OmniFocus" extension by Leonid Shevtsov.