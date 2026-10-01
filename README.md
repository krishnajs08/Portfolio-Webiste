# Krishna Pangarkar — Portfolio

A single-page portfolio site: soft-tech / aesthetic UI, light & dark mode,
custom cursor, magnetic buttons, scroll reveals, and a scattered-photo hero.

## Structure
```
index.html        — markup
css/style.css      — all styles (design tokens + light/dark themes at the top)
js/script.js        — all behaviour (theme toggle, cursor, marquees, form, etc.)
assets/             — photos (.webp) + résumé (.pdf)
```

## Run it
No build step — it's plain HTML/CSS/JS. Just open `index.html` in a browser,
or serve the folder locally so relative asset paths resolve cleanly:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## To customize
- **Links:** search `index.html` for `href="#"` in the social icons — drop in
  your real GitHub / LinkedIn / LeetCode URLs.
- **Résumé:** swap `assets/Krishna_Pangarkar_Resume.pdf` for an updated copy
  (keep the same filename, or update the two `href` references to it).
- **Colors:** edit the CSS variables at the top of `css/style.css` under
  `:root` (light mode) and `:root[data-theme="dark"]` / the matching
  `prefers-color-scheme: dark` block (dark mode).
- **Content:** project cards, experience, skills and copy all live directly
  in `index.html` — no CMS or data file, just edit the markup in place.

## Notes
- Theme preference is saved to `localStorage` and respects the OS setting
  by default.
- All motion respects `prefers-reduced-motion`.
- The contact form currently opens the visitor's mail client (`mailto:`)
  with the message pre-filled — there's no backend yet. If you want a real
  MERN backend (Express API + MongoDB storage for submissions, admin login,
  etc.), that's a separate build — just ask.
