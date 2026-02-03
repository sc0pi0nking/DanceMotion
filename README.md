# DanceMotion Website

Website für DanceMotion Eschweiler - Offene Tanzgemeinschaft.

## Dev
npm install
npm run dev

## Docker (local)
docker compose -f docker-compose.local.yml up --build

## Docker (server)
docker compose up -d --build

Theme toggle (Dark/Light)
-------------------------
This project includes a theme toggle (top-right in the header) which switches between dark and light themes.

- Theme is stored in `localStorage` under key `theme` and persists across reloads.
- On first visit the toggle will use the user's `prefers-color-scheme` setting.
- The toggle sets `document.documentElement.dataset.theme = 'dark'|'light'` so CSS variables are applied.

Dev note: The theme toggle is visible both in dev and production; no server changes are required.
