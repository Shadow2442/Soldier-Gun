# Website Workspace

This folder is the public-facing release surface for the project website.

- Keep only files here that are meant to be published.
- If an asset is internal research or working material, it belongs in `project/`, not here.
- If an asset is part of the game build itself, it usually belongs in `game/` unless we intentionally duplicate a web-safe copy here.
- Open the site through `tools\open-website.cmd` so it always launches in Google Chrome.
- GitHub Pages publishes this folder from the `gh-pages` branch via a subtree push.

## Current live prototype

- `index.html`: public landing page plus the playable Ship Animation Testing layer
- `scripts/site.js`: browser flight prototype, pulse weapon phases, ship thrusters, and Web Audio effects
- `styles/site.css`: public site styling plus the flight-layer controls and layout
- `assets/generated/`: ship sprite sheets used by the browser prototype
