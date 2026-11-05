# Abhijeet Udyog Samuh

A bilingual, responsive static website for the family's nine businesses. Site copy, business details, SEO copy, display stats, site URL, and the WhatsApp destination are maintained in [`site-data.json`](site-data.json).

## Configure before publishing

- Set `config.whatsappNumber` in `site-data.json` to the WhatsApp destination in international digits only, including the country code and without `+` or spaces. The enquiry form stays on the page and explains that setup is needed while this value is blank.
- Replace the address, names, email and other marked placeholders in the translations and business records with verified details. Add an `address` object to each business record for its `LocalBusiness` schema when you have the verified address (for example, `{"streetAddress":"…","addressLocality":"…","addressRegion":"…","postalCode":"…","addressCountry":"IN"}`).
- Set `config.siteUrl` and the canonical/ Open Graph fallback values in `index.html` if the GitHub Pages URL will differ from `https://saiwasankar.github.io/homebrew/`.

## Live updates

The homepage directory search filters businesses as visitors type. Current announcements and offers are read from `config.liveUpdates` in `site-data.json`. Add an item with `start` and `end` dates (`YYYY-MM-DD`), an optional `businessId`, and English and Marathi copy:

```json
{
  "start": "2026-11-01",
  "end": "2026-11-15",
  "businessId": "honda",
  "en": { "title": "Verified update title", "text": "Verified details" },
  "mr": { "title": "मराठी शीर्षक", "text": "मराठी तपशील" }
}
```

Expired or not-yet-active items are hidden automatically. Since GitHub Pages serves static files, publishing an edit to `site-data.json` is how the family updates the feed; this is not an admin dashboard or a live connection to business systems.

## GitHub Pages

The site is a static root-level site and uses relative paths for its CSS, JavaScript, content JSON, and image asset. In the repository, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save. `.nojekyll` tells Pages to publish the files directly.

For local preview, serve the repository with any static HTTP server so `app.js` can fetch `site-data.json`; opening `index.html` as a `file://` URL does not support that fetch consistently.
