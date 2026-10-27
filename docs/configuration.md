# Configuration and security

This page covers the `VITE_API_KEY` setting, the security risk it carries, and how to restrict the key. For setup steps, see [Getting started](getting-started.md). For the overall project, see the [README](../README.md).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_KEY` | Yes | Google Cloud API key used to call the Drive v3 API |

The variable is defined in `.env`. A starting copy is in `.env.example`, which has `VITE_API_KEY=` with no value.

Vite replaces `import.meta.env.VITE_API_KEY` with the value at build time. Changing the value needs a dev server restart for `npm run dev`, or a new build for deployed copies.

## Security risk: the key is public

Because the key is read in the browser, it is inside the JavaScript that every visitor downloads. Anyone can open the browser's developer tools or view the bundle and copy it. Treat this key as public.

This means:

- Do not use a key that is also used for anything sensitive, such as billing-heavy or private APIs.
- Restrict the key to the Drive API, so it can't be used for other Google services.
- Restrict the key to the websites that should use it.
- Be prepared to rotate the key if it is abused.

## Restricting the key

HTTP referrer restrictions limit which websites can use a key. From the Google Cloud docs:

- Wildcards are allowed only for a subdomain or path, for example `*.example.com/*`. A wildcard in the middle of a URL is not valid.
- To allow a whole site, add two entries: `example.com/*` and `*.example.com/*`.
- Some browsers send only the origin for cross-origin requests. Keys with page-specific URL restrictions may not match for those browsers.

Limits to keep in mind: referrer checks only apply to browser requests. A script or other non-browser client can send any referrer value, so this restriction reduces casual misuse but does not fully protect the key.

### Create and restrict a key

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. Enable the **Google Drive API** for the project.
3. Go to **APIs & Services > Credentials**, choose **Create credentials > API key**.
4. Open the new key and set **API restrictions** to only the Google Drive API.
5. Set **Application restrictions** to **Websites**, and add the referrers for your deployment (for example `your-domain.com/*` and `*.your-domain.com/*`). Add `localhost` entries if you develop locally.
6. Save, then put the key in `.env` as `VITE_API_KEY`.

## Rotating the key

1. Create a new restricted key using the steps above.
2. Update `VITE_API_KEY` in `.env` locally and in your deployment environment.
3. Rebuild and redeploy, or restart the dev server.
4. Confirm the gallery loads.
5. Delete the old key in the Google Cloud Console.

## Keep `.env` out of git

`.env` is listed in `.gitignore`, so it is not committed by default. Check that it stays that way before you push:

```bash
git check-ignore -v .env
```

Only `.env.example` should be tracked. It contains no real value.

## Drive folder sharing

The gallery needs the folder to be shared so the API key can list its files. In practice this usually means sharing it as **Anyone with the link** (Viewer). The folder must also contain image files. Google Drive's own sharing docs cover the exact options.

Note: the Google Drive authentication guide did not return content when checked, so the rule that an API key alone can list a shared folder has not been verified against that page. Confirm it by testing with a folder before relying on it.

## Where the thumbnail and download URLs come from

The gallery shows images through `drive.google.com/thumbnail?id=...&sz=...`. The download link uses `drive.google.com/uc?export=download&id=...`. Google does not document either URL in the Drive v3 reference, so they may change. See [Troubleshooting](troubleshooting.md) for what to check if images stop loading.
