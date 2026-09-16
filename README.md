# Liquid New Tab

Liquid New Tab is a focused Chrome new-tab extension built around one large search lens and a small orbit of the websites you use most.

[Download the latest release](https://github.com/RSK21X/liquid-new-tab/releases/latest)

## Features

- Dark-only liquid-glass interface with a quiet, centered layout.
- Search by clicking the lens or pressing `/`.
- Click outside the expanded search lens, or press `Escape`, to close it.
- Enter a URL to open it directly, or search with the selected engine.
- Use `@g`, `@yt`, and `@gh` to send a query to Google, YouTube, or GitHub.
- Use `>edit` and `>settings` for quick commands.
- Add, remove, and reorder shortcuts around the orbit.
- Reorder shortcuts with arrow keys while editing.
- Load a custom image background locally, or return to the built-in dark glass field.
- Choose English or Chinese from Settings.
- Choose low, normal, or high glass intensity.
- Use a local extension icon and website-owned favicon paths, with Morphicons as the fallback when a site has no usable icon.

## Privacy

The extension is local-first:

- No account is required.
- No analytics or tracking code is included.
- Preferences and shortcuts are stored in Chrome's local extension storage.
- The extension requests only the `storage` permission.
- Custom background images are stored locally in the extension's data.
- Shortcut icons are requested from the shortcut website itself. A site may block its favicon; that does not affect navigation.

## Install from a release

### ZIP — recommended

1. Download `liquid-new-tab-v0.1.0.zip` from the [latest release](https://github.com/RSK21X/liquid-new-tab/releases/latest).
2. Unzip it into a folder that you will keep.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode**.
5. Click **Load unpacked** and select the unzipped folder.

### CRX — optional

The release also includes a `.crx` package. Chrome may block direct installation of CRX files downloaded from the internet, depending on the browser and operating system. If Chrome rejects it, use the ZIP instructions above; the extension contents are the same.

## Local development

Requirements: Node.js 18 or newer and Chrome.

```bash
npm install
npm run dev
```

The Vite server is useful for previewing the page. To build the extension bundle:

```bash
npm run check
npm run build
```

Then load the generated `dist/` directory from `chrome://extensions` with **Load unpacked** enabled.

## Project structure

```text
src/              React application and UI components
public/           Chrome manifest and local icon assets
public/icons/     16, 32, 48, and 128px extension icons
dist/             Generated extension bundle (created by npm run build)
```

## Design references

The material language is a web implementation inspired by [TonniTools Liquid Glass](https://www.tonnitools.com/liquid-glass/), using transparent layers, refraction-style highlights, borders, and pointer illumination rather than an opaque panel color. UI glyphs use [Morphicons](https://www.morphicons.com/) with icon data from [Lucide](https://lucide.dev/).

The extension icon is kept local and compact: a dark glass tile with a cool-aqua search lens and small refraction highlights so it remains recognizable in Chrome's toolbar and extension manager at small sizes.
