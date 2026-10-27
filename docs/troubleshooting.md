# Troubleshooting

Common problems, what causes them, and how to fix them. For setup, see [Getting started](getting-started.md). For the API key and folder sharing, see [Configuration and security](configuration.md). For the code layout, see [Architecture](architecture.md).

Each entry lists the symptom, the likely cause, and the fix. Check the browser's developer console for error messages when a gallery fails.

## The page goes to `/null`, or the gallery is empty straight away

Cause: the pasted text didn't contain `/folders/`. The Setup page only recognizes folder links. A file link, a shortened link, or plain text gives an ID of `null`.

Fix: open the folder in Google Drive, click **Share**, then **Copy link**. The link should contain `/folders/` followed by an ID. Paste that link on the Setup page.

## "Loading..." never goes away and no images appear

Cause: the Drive API returned an error instead of a file list. The app logs the error to the console and keeps showing the loading message.

Fix: open the developer console and read the error. Then check the matching cause below:

- **API key not valid, or key missing**: `VITE_API_KEY` is empty or wrong. See the next section.
- **Requests blocked by referrer restrictions**: the site's address isn't in the key's allowed websites. Add it, and add `localhost` entries for local development. See [Configuration and security](configuration.md#restricting-the-key).
- **Drive API not enabled**: enable the Google Drive API for the project in the Google Cloud Console.
- **Quota exceeded**: the project has hit its API limit. Wait for the quota to reset, or check the quota page in the Google Cloud Console.

## `VITE_API_KEY` is set, but requests still fail

Cause: Vite reads `VITE_*` values when the dev server starts, and inlines them into builds. A running dev server or an old build keeps the old value. A missing `.env` file also leaves the value empty.

Fix:

1. Confirm `.env` exists in the project root and contains `VITE_API_KEY=<your key>`. The file is ignored by git, so it won't appear in a fresh clone. Copy `.env.example` to create it.
2. Stop the dev server and start it again with `npm run dev`.
3. For a deployed copy, rebuild with `npm run build` after changing the value, then redeploy.

## The gallery loads, but shows no images

Cause: one of these:

- The folder isn't shared, so the key can't see its files.
- The folder has no image files at the top level. The query doesn't include subfolders.
- The files are not images as Drive reports them. Only files with an `image/` type are listed.

Fix: confirm the folder is shared, open it in Google Drive and check that the photos are directly inside it, not in a subfolder. Then reload the gallery.

## Thumbnails or previews don't load

Cause: the thumbnail URL (`drive.google.com/thumbnail?id=...`) is undocumented by Google and may have changed. A file that can't be viewed in Drive also won't load here.

Fix:

1. Open one of the images in Google Drive. If it doesn't open, fix the file's sharing.
2. If it opens in Drive but not in the gallery, the thumbnail URL may have changed. Both URLs are built in `src/pages/Gallery.jsx`: the grid thumbnail uses `sz=w800`, and the modal preview uses `sz=w1600`.

## The download button opens a Google page instead of downloading

Cause: the download link uses `drive.google.com/uc?export=download&id=...`. This URL is undocumented by Google, so its behavior may change.

Fix: open the image in Google Drive and download it from there. If you maintain the app, check the `uc` URL in `src/pages/Gallery.jsx` against current Drive behavior.

## Photos keep appearing slowly

Cause: this is how the app works. The first 10 photos load right away. Each later batch of 10 waits for a timer first. The wait starts at 2.5 seconds and rises by 0.1 seconds per batch, then returns to 2.5 seconds. Waits cycle between 2.5 and 4.9 seconds.

As a rough guide, a folder with 100 photos takes around 30 seconds or more to load fully. The timing is documented as it is in the code. See [Architecture](architecture.md#pagination-timing).

Fix: nothing needed. To change the behavior, edit the timer in `src/pages/Gallery.jsx`.

## Build shows a Tailwind CSS warning

Cause: the build prints a warning about `@property` and `@layer` while optimizing the CSS. The build still completes and the output is usable.

Fix: none needed for the current build. If you're working on styles, check the warning when you change `src/index.css`.

## Still stuck

Check the developer console and the Network tab for the failing request to `googleapis.com`. Note the HTTP status and error message. Those usually point to the cause above.
