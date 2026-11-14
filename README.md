# Simetto Gelato

A Simetto Gelato website built with React, TypeScript and Vite. The homepage introduces the brand with animated cups, a short About section, four featured flavours and a footer. Explore All Flavours opens the separate interactive menu, starting with Pistachio and continuing through all sixteen flavours.

## Where to edit

| To change | Open |
| --- | --- |
| Page layout, buttons and navigation | [src/App.tsx](src/App.tsx) |
| Landing headline, cup placement and scroll movement | [src/Landing.tsx](src/Landing.tsx) · [src/landing.css](src/landing.css) |
| About, featured flavours and footer | [src/HomeContent.tsx](src/HomeContent.tsx) · [src/home.css](src/home.css) |
| Bowl size, colours, spacing and animations | [src/menu.css](src/menu.css) |
| Brand palette, curves and paper grain | [src/menu.css](src/menu.css), starting at `:root` and `.site-background` |
| Original individual flavour colours and verified social links | [src/menuContent.ts](src/menuContent.ts) |
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

The navigation appears after scrolling and stays visible in the full menu. Discover scrolls to About Simetto, followed by the featured flavours. Explore All Flavours, the navigation’s Menu option and the footer’s All Flavours link open the full menu at `#flavour-menu`. The logo returns home; About links return to the introduction. Browser Back and Forward work between these views.

The cup movement follows the page scroll through a single animation frame update. Reduced-motion preferences show stationary cups, reveal content immediately and use immediate anchor scrolling. The homepage uses the blue, ivory and green brand palette; the full menu keeps its original individual flavour backgrounds.

The menu decodes the destination bowl before changing the image, name, notes and counter together. It warms the adjacent images and coalesces rapid navigation to the latest destination. Reduced-motion preferences switch flavours immediately.

The language button shows TR while browsing in English and EN while browsing in Turkish. Tap it to switch languages on the current flavour. First-time visitors see English, and the browser remembers a visitor’s selection for future visits.

## Editing the menu

Edit `data/flavours.json`. Each entry contains its name, a stable ID, the original PNG path, a short description, and a price. The descriptions are editable sensory suggestions for the preview. They can be replaced with the shop's approved copy or cleared.

Turkish names and descriptions live in `data/flavours.tr.json`, keyed by the same flavour IDs. Both languages share the images, prices and menu order.

All prices start as `null`. When the shop supplies prices, enter the full display string, including its currency, in the matching `price` field. Null or empty values stay hidden. The order of the data matches the source menu. The frontend rotates that order to open with Pistachio as 01 / 16.

The unchanged PNGs live in `public/assets/flavours/`. Full-size WebP delivery images live in `public/assets/bowls/` and 128-pixel thumbnails in `public/assets/thumbs/`, each named by flavour ID. Keep all three versions in sync when replacing a bowl. The original checksums are in `ASSET_MANIFEST.json`.

The supplied transparent landing cups live in `public/assets/landing/`. Their PNG originals are accompanied by 480px and 960px WebP versions for responsive delivery.

The three-line button opens the site navigation. Menu returns to the selected flavour, and About opens the homepage introduction. Footer location and Instagram links reuse the URLs supplied by the shop. Privacy and cookie links can be added once real policy content and URLs are supplied; no placeholder legal content is published.

## Publishing

The [live menu](https://real3bvd.github.io/simetto-gelato/) is served from the root of the `gh-pages` branch. Keep source changes on `main`. To publish an update from a checkout with GitHub push access, install the locked dependencies with `npm ci`, push your changes to `main`, and run `npm run deploy`.

The deploy command checks TypeScript, builds the site locally and pushes the contents of `dist/` to `gh-pages`. GitHub Pages then updates the same public address.
