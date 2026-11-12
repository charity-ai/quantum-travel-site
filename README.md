# Quantum Travel

The public site for Quantum Travel, an independent travel advisory affiliated with Surge365.

Live booking engine: pending. Set `bookingUrl` in `app.js` once the Vortex URL is confirmed.

Production domain: https://quantumtravel365.com

Branded short link: https://quantumtravel365.com/book (302 to the booking engine)

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies. Cloudflare Pages serves the repository root directly.

```
index.html      page markup, metadata, structured data
styles.css      all styling, mobile first
app.js          SITE config block, interactions, form handling
assets/brand/   logo files, favicons, app icons
assets/places/  destination photography
assets/people/  advisor portraits
robots.txt      crawler policy, explicitly open to AI answer engines
sitemap.xml     single-page sitemap
_headers        security and cache headers for Cloudflare Pages
```

## The one line that matters

`app.js` opens with a config block. Every booking button, the navigation call to action and the footer link read from it.

```js
const SITE = {
  bookingUrl: '', // e.g. https://www.myvortex365.com/yourvortexname
  email: 'charity@quantumtravel365.com',
  formEndpoint: '', // paste a GoHighLevel inbound webhook to go live
  ...
};
```

Change `bookingUrl` once and the whole page follows. Leave `formEndpoint` empty and the trip request form runs in preview mode, which is safe for demos but does not deliver leads.

## About the booking URL

Surge365 gives you two different links and they are not interchangeable.

- `surge365.com/yourname` is the **business opportunity** page. It pitches joining the company. Never send travel clients there.
- `myvortex365.com/yourvortexname` is your **customer travel site**, where people search and book. This is the one that belongs in `bookingUrl`.

Find the Vortex name in the back office at my.surge365.com, in the Vortex or Marketing Site section, or in your welcome email. While `bookingUrl` is empty, every booking button opens the trip request form so no lead is lost.

## Local preview

```sh
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Deploy on Cloudflare Pages

1. Cloudflare dashboard, Workers and Pages, Create, Pages, Connect to Git.
2. Pick this repository. Framework preset: None. Build command: leave empty. Build output directory: `/`.
3. Save and deploy. Every push to `main` redeploys automatically.
4. Custom domains, add `quantumtravel365.com` and `www.quantumtravel365.com`.
5. Add a Redirect Rule so `www` 301s to the apex. The `_redirects` file also covers this once both hostnames are attached.

## Before going public

- Replace the destination photographs with licensed images or your own. The current set is placeholder art for layout.
- Confirm the California Seller of Travel registration number and put it in the footer, replacing `[to be inserted]`.
- Connect the form to a GoHighLevel inbound webhook so requests become contacts.

## Brand

Midnight `#0A1A2A`, Horizon Gold `#C9A45B`, Ivory `#FBF8F3`. Cormorant Garamond for headlines, Jost for labels, Manrope for body copy. The mark is a Q whose tail is a paper plane.
