# Liquid New Tab

Liquid New Tab is a Manifest V3 Chrome extension that keeps the new tab focused on two actions: search and opening the websites you use often.

The interface follows the PRD's three-state model:

- Rest: a quiet center lens and a small orbit of shortcuts.
- Search: the lens expands in place and handles search, URL navigation, `@g`, `@yt`, `@gh`, and `>` commands.
- Edit: shortcuts can be added, removed, dragged between slots, or reordered with the keyboard.

All preferences and shortcuts are stored locally. The extension requests only the `storage` permission. Shortcut icons are requested directly from each website's own domain, with a local Morphicons fallback when a site does not expose a usable icon.

## Local development

```bash
npm install
npm run dev
```

The Vite page is a browser preview. To build the extension bundle:

```bash
npm run build
```

Load the generated `dist/` directory from `chrome://extensions` with Developer mode enabled, then use **Load unpacked**.

## Design notes

The Liquid Glass effect is an explicitly labeled web approximation built from the TonniTools layered CSS material. The search lens, settings surface, and shortcut nodes share the same transparent treatment. The page uses a single cool-aqua accent, a dark-only canvas, website-owned favicon paths with a Morphicons fallback, local image backgrounds, CSS pointer illumination, and a reduced-motion fallback.

The material structure is adapted from [TonniTools Liquid Glass](https://www.tonnitools.com/liquid-glass/). UI glyphs are rendered with [Morphicons](https://www.morphicons.com/) using the official `MorphIcon` React renderer and icon data from the `lucide` package.
