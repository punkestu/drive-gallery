# SOREAJA Drive Gallery

A small React app that turns a public Google Drive folder of images into a browsable photo gallery. Paste a Drive folder link, and the app shows the images in a grid with a preview and download option for each one.

![Gallery preview](public/og_thumbnail.png)

## Quick start

```bash
npm install
cp .env.example .env   # then set VITE_API_KEY
npm run dev
```

Before the gallery shows any images, the Drive folder must be shared and the API key must be set. See the getting-started guide for details.

## Documentation

| Guide | For | Description |
| --- | --- | --- |
| [Getting started](docs/getting-started.md) | Maintainers | Install, configure, and run the app locally |
| [Usage](docs/usage.md) | End users | How to open a gallery, browse, and download images |
| [Configuration and security](docs/configuration.md) | Maintainers | `VITE_API_KEY`, key restrictions, and the security risk |
| [Architecture](docs/architecture.md) | Maintainers | Routes, components, and the Drive API flow |
| [Troubleshooting](docs/troubleshooting.md) | Both | Common problems, causes, and fixes |

The implementation plan for these docs is in [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).
