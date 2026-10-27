# Getting started

This guide walks you through running SOREAJA Drive Gallery locally. For what the app does, see the [README](../README.md).

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`. This is the range Vite 8 requires. The project does not declare its own `engines` field.
- npm (the repo includes `package-lock.json`).
- A Google Cloud API key with the Google Drive API enabled. See [Configuration and security](configuration.md).
- A Google Drive folder of images that is shared so the API key can list it. See [Sharing requirement](configuration.md#drive-folder-sharing).

## Install

```bash
npm install
```

## Set up the environment

Copy the example file and add your key:

```bash
cp .env.example .env
```

Then set `VITE_API_KEY` in `.env`:

```bash
VITE_API_KEY=your-api-key-here
```

`.env` is listed in `.gitignore`, so it won't be committed. Vite reads `VITE_*` variables at startup and inlines them into the bundle. If you change `.env`, restart the dev server.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with hot reload |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the `dist/` build locally for a final check |
| `npm run lint` | Runs ESLint across the project |

## Run locally

```bash
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`. Paste a shared Drive folder link on the first page to open a gallery.

## Verify your setup

```bash
npm run build
npm run lint
```

Both commands should exit without errors. The build may print a CSS warning from Tailwind's optimizer. This does not stop the build.

Next: [Usage](usage.md) for end-user steps, or [Configuration and security](configuration.md) before you deploy anything.
