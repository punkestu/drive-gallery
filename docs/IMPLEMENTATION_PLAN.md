# Implementation Plan - Project Documentation for SOREAJA Drive Gallery

## Problem Statement

The repo's README is still the default Vite + React template and says nothing about this project. End users need to know how to use the gallery, and maintainers need to know how to set it up, configure the API key safely, and understand the code. The docs should cover setup, usage, configuration and security, architecture with diagrams, and troubleshooting. Scope is documentation only. No source code changes.

## Requirements

- Audience: end users and maintainers
- Location: a `docs/` folder, with README.md as the entry point that links to it
- Content: setup, usage, API key security note, Drive sharing requirement, Mermaid diagrams of routing and request/pagination flow
- Research sources: official Drive v3 and Google Cloud docs
- Known behavior: document the pagination timer as-is, without judgment

## Background

- Routes (`src/Router.jsx`): `/` renders `Setup`, `/:id` renders `Gallery`. Both are lazy-loaded.
- `Setup.jsx`: extracts the folder ID with `/\/folders\/([^/?]+)/`. If the URL doesn't match, the ID is `null` and the app navigates to `/null`. This is a limitation to document.
- `Gallery.jsx`: calls `https://www.googleapis.com/drive/v3/files` with `q` set to list images in the folder (`mimeType contains 'image/'`, `trashed=false`), `pageSize=10`, and `fields=nextPageToken,files(id,name,mimeType)`. Thumbnails use `drive.google.com/thumbnail?id=...&sz=w800`. The modal uses `sz=w1600` and a download link through `uc?export=download`.
- Pagination: the first page loads right away. Each later page is requested after a timer. The timer starts at 2500 ms and grows by 100 ms per page, wrapping at 2500. Document this as-is.
- `Modal.jsx`: closes on Escape and on browser back, using history state.
- Config: `VITE_API_KEY` in `.env` (see `.env.example`). Vite inlines it at build time, so the dev server must restart after changes.
- Scripts: `dev`, `build`, `lint`, `preview`.
- Verified in Google docs: `pageSize` max is 1000 and `nextPageToken` drives paging. API keys can be restricted by website HTTP referrer, with wildcards only at the start of a host or path.
- Not verified: the Drive auth guide returned no content, so the API-key-only folder listing rules are unconfirmed. The thumbnail and `uc?export=download` URLs are undocumented by Google, so the docs should flag them as unstable.

## Proposed Solution

Doc structure: README.md (entry point) links to `docs/getting-started.md`, `docs/usage.md`, `docs/configuration.md`, `docs/architecture.md`, and `docs/troubleshooting.md`. `configuration.md` links to `getting-started.md`. `architecture.md` links to `configuration.md`.

Routing and data flow (Mermaid sequenceDiagram):

- User pastes Drive folder URL into Setup page
- Setup extracts folder ID and navigates to /:id
- Gallery calls Drive API files.list (pageSize=10, q=folder images)
- API returns files + nextPageToken
- Gallery loads thumbnails lazily
- Gallery waits on timer, then requests next page
- User clicks image, Gallery loads w1600 preview in modal

Each doc has one clear audience. The end-user pages avoid code. The architecture page is for maintainers. README.md links to everything, and each doc links back to README.

Verification: there is no docs test framework. Each task is checked by running the documented commands (`npm run build`, `npm run lint`) and following the steps as written. A markdown link checker or linter is optional and needs approval first, since it adds a dev dependency that must be pinned.

## Task Breakdown

### Task 1: Create the docs skeleton and the README entry point
- Objective: Replace the template README with a project overview and create the `docs/` folder with links to every planned doc.
- Guidance: Keep README to name, one-paragraph description, a screenshot placeholder, a quick-start summary, and a links table to `docs/`. Remove the Vite template text. Create placeholder files for the five docs with headings only.
- Tests: Confirm every link in README resolves to an existing file.
- Demo: Open README on GitHub or in a preview. All links point to the docs skeleton.

### Task 2: Write the getting-started guide
- Objective: Document prerequisites, install, environment setup, and running the app.
- Guidance: Cover Node version (check `engines` and lockfile first), `npm install`, copying `.env.example` to `.env`, setting `VITE_API_KEY`, the Drive folder sharing requirement, and the `dev`, `build`, `lint`, and `preview` scripts. Note that the dev server must restart after `.env` changes.
- Tests: Run `npm run build` and `npm run lint` to confirm the documented commands work. Follow the guide from a clean checkout to confirm it is accurate.
- Demo: A new contributor can start the dev server from the guide alone.

### Task 3: Write the configuration and security guide
- Objective: Document `VITE_API_KEY`, the security risk, and how to restrict the key.
- Guidance: State that the key is in the client bundle and visible to anyone who loads the page. Explain the HTTP referrer restriction and its limits (non-browser clients can send any referrer). Add steps for creating and restricting the key in Google Cloud Console, rotating it, and not committing `.env`. Cite the Google docs. Flag that the Drive auth guide could not be verified.
- Tests: Check that `.gitignore` covers `.env`, and that every referenced link works.
- Demo: A maintainer can create a restricted key by following the guide.

### Task 4: Write the end-user usage guide
- Objective: Explain how to use the gallery.
- Guidance: Cover how to get a Drive folder link, what the folder must contain (images, shared so the key can list it), pasting the link on the Setup page, browsing and loading more images, opening the preview, and downloading. Describe the Escape and back-button close behavior. Keep it plain and non-technical.
- Tests: Walk through each step in the running app and confirm each described behavior matches.
- Demo: A non-technical reader can open a gallery and download an image using only this page.

### Task 5: Write the architecture guide with diagrams
- Objective: Document structure, routing, components, and the Drive API flow for maintainers.
- Guidance: Describe `Router.jsx`, `Setup`, `Gallery`, `Modal`, and `main.jsx`. Include the routing and sequence diagrams. Document pagination as-is: first page immediate, later pages after a timer starting at 2500 ms and growing 100 ms per page, wrapping at 2500. List the Drive API parameters used and the thumbnail URL sizes. Note the React Compiler and Tailwind setup from `vite.config.js`.
- Tests: Confirm each diagram renders in a Mermaid-capable preview. Check the timer description against the code line by line.
- Demo: A maintainer can find where to change routing, fetch behavior, or the modal from the guide.

### Task 6: Write the troubleshooting and known limitations page
- Objective: Help users and maintainers fix common problems and understand current limits.
- Guidance: Cover: invalid folder URL leads to `/null`, the gallery shows no images (folder not shared or no image files), API errors in the console (bad or restricted key, quota), `VITE_API_KEY` missing or not restarted, thumbnails failing because the URLs are undocumented, and the timer-based loading behavior. Keep each entry as symptom, cause, fix.
- Tests: Reproduce each documented symptom where possible and check the fix.
- Demo: A user with a broken link can find the cause and fix on this page.

### Task 7: Final wiring and review
- Objective: Connect all docs, check cross-links, and confirm the build still passes.
- Guidance: Add a "Back to README" link to each doc. Check every doc links to the related pages from Tasks 2 to 6. Make sure the terms match across docs (folder ID, API key, thumbnail). Confirm README lists all docs.
- Tests: Run `npm run build` and `npm run lint`. Check all links across the docs.
- Demo: Starting from README, a reader can reach every doc, and every link works.
