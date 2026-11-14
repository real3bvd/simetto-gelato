# Simetto Gelato

A Simetto Gelato landing page and browse-only menu built with React, TypeScript and Vite. Discover our flavours scrolls from the animated cups into the menu, which opens on Pistachio and continues through all sixteen flavours.

## Where to edit

| To change | Open |
| --- | --- |
| Page layout, buttons and navigation | [src/App.tsx](src/App.tsx) |
| Landing headline, cup placement and scroll movement | [src/Landing.tsx](src/Landing.tsx) · [src/landing.css](src/landing.css) |
| Bowl size, colours, spacing and animations | [src/menu.css](src/menu.css) |
| Shared cream background, curves and paper grain | [src/menu.css](src/menu.css), starting at `.site-background` |
| Swipes, keyboard controls and transition timing | [src/useFlavourMenu.ts](src/useFlavourMenu.ts) |
| Flavour names, descriptions and prices | [English menu and prices](data/flavours.json) · [Turkish translations](data/flavours.tr.json) |
| English and Turkish interface labels | [src/menuContent.ts](src/menuContent.ts) |
| Bowl photos, thumbnails and the logo | [public/assets](public/assets/) |

Open this folder in VS Code to use the project’s Explorer layout. Expand `package.json` for build configuration or `README.md` for project notes. You can adjust which folders appear in [.vscode/settings.json](.vscode/settings.json).

## Run locally

Use Node.js 22.12 or newer, or Node 20.19 and a later 20.x release. From this project directory, run the following commands.

```sh
npm ci
npm run dev
```

Open the local address Vite prints in the terminal. To check TypeScript and compile the production site, run `npm run build`. The build writes to `dist/`. Run `npm run preview` to serve that build locally.

## Browsing

Choose a named bowl from the scrollable strip at the bottom. Desktop users can browse with the wheel or arrow keys. Home and End select the first and last displayed flavours. On phones, swipe the featured bowl to change flavour or scroll the strip to find one by name.

The navigation appears after scrolling. Its Menu option and the landing page’s Discover button scroll to the interactive menu. Scroll upward to return to the landing page. The cup movement follows the page scroll through a single animation frame update. Reduced-motion preferences show stationary cups and use immediate anchor scrolling.

The menu decodes the destination bowl before changing the image, name, notes and counter together. It warms the adjacent images and coalesces rapid navigation to the latest destination. Reduced-motion preferences switch flavours immediately.

The language button shows TR while browsing in English and EN while browsing in Turkish. Tap it to switch languages on the current flavour. First-time visitors see English, and the browser remembers a visitor’s selection for future visits.

## Editing the menu

Edit `data/flavours.json`. Each entry contains its name, a stable ID, the original PNG path, a short description, and a price. The descriptions are editable sensory suggestions for the preview. They can be replaced with the shop's approved copy or cleared.

Turkish names and descriptions live in `data/flavours.tr.json`, keyed by the same flavour IDs. Both languages share the images, prices and menu order.

All prices start as `null`. When the shop supplies prices, enter the full display string, including its currency, in the matching `price` field. Null or empty values stay hidden. The order of the data matches the source menu. The frontend rotates that order to open with Pistachio as 01 / 16.

The unchanged PNGs live in `public/assets/flavours/`. Full-size WebP delivery images live in `public/assets/bowls/` and 128-pixel thumbnails in `public/assets/thumbs/`, each named by flavour ID. Keep all three versions in sync when replacing a bowl. The original checksums are in `ASSET_MANIFEST.json`.

The supplied transparent landing cups live in `public/assets/landing/`. Their PNG originals are accompanied by 480px and 960px WebP versions for responsive delivery.

The three-line button and the Simetto logo open the site navigation. Menu returns to the selected flavour. About is disabled.

## Publishing

The [live menu](https://real3bvd.github.io/simetto-gelato/) is served from the root of the `gh-pages` branch. Keep source changes on `main`. To publish an update from a checkout with GitHub push access, install the locked dependencies with `npm ci`, push your changes to `main`, and run `npm run deploy`.

The deploy command checks TypeScript, builds the site locally and pushes the contents of `dist/` to `gh-pages`. GitHub Pages then updates the same public address.
