# Simetto Gelato

A browse-only gelato menu built with React, TypeScript and Vite. It opens on Pistachio and continues through all sixteen flavours in the order on the shop board, wrapping back to the beginning.

## Run locally

Use Node.js 22.12 or newer, or Node 20.19 and a later 20.x release. From this project directory, run the following commands.

```sh
npm ci
npm run dev
```

Open the local address Vite prints in the terminal. To check TypeScript and compile the production site, run `npm run build`. The build writes to `dist/`. Run `npm run preview` to serve that build locally.

## Browsing

Choose a named bowl from the scrollable strip at the bottom, or open the three-line flavour index. Desktop users can browse with the wheel or arrow keys. Home and End select the first and last displayed flavours. On phones, swipe the featured bowl to change flavour or scroll the strip to find one by name. Escape closes the index.

The menu decodes the destination bowl before changing the image, name, notes and counter together. It warms the adjacent images and coalesces rapid navigation to the latest destination. Reduced-motion preferences switch flavours immediately.

## Editing the menu

Edit `data/flavours.json`. Each entry contains its name, a stable ID, the original PNG path, a short description, and a price. The descriptions are editable sensory suggestions for the preview. They can be replaced with the shop's approved copy or cleared.

All prices start as `null`. When the shop supplies prices, enter the full display string, including its currency, in the matching `price` field. Null or empty values stay hidden. The order of the data matches the source menu. The frontend rotates that order to open with Pistachio as 01 / 16.

The unchanged PNGs live in `public/assets/flavours/`. Full-size WebP delivery images live in `public/assets/bowls/` and 128-pixel thumbnails in `public/assets/thumbs/`, each named by flavour ID. Keep all three versions in sync when replacing a bowl. The original checksums are in `ASSET_MANIFEST.json`.

The three-line menu and the transparent Simetto logo both open the flavour index.

## Publishing

The [live menu](https://real3bvd.github.io/simetto-gelato/) is served from the root of the `gh-pages` branch. Keep source changes on `main`. To publish an update from a checkout with GitHub push access, install the locked dependencies with `npm ci`, push your changes to `main`, and run `npm run deploy`.

The deploy command checks TypeScript, builds the site locally and pushes the contents of `dist/` to `gh-pages`. GitHub Pages then updates the same public address.
