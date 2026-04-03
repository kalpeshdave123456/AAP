# MF Planner Pro

A GitHub-ready, client-side wealth planning app focused on mutual fund strategy, asset allocation, goal readiness, and retirement planning.

## What's improved vs the original MVP

- Profile-based target allocation instead of one static allocation for every user
- Mutual-fund-first recommendation table with sample Value Research and Moneycontrol fields
- Health score, portfolio diagnostics, and advisor notes
- Goal feasibility and retirement base/stress scenario views
- Save profile locally in browser
- Print/export-friendly layout
- Works fully on GitHub Pages with no backend

## Important note on ratings and data

This starter includes **sample fund metadata and sample rating fields** for UX demonstration.
Before production use, replace the `fundData` object in `app.js` with your maintained dataset, CSV pipeline, or API-fed data source.

## Files

- `index.html` – layout and sections
- `style.css` – premium dark UI
- `app.js` – planning logic, scoring, charts, and local storage

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all files from this folder to the repo root
3. Commit and push
4. In GitHub, go to **Settings → Pages**
5. Set source to **Deploy from a branch**
6. Choose `main` branch and `/root`
7. Save

Your site should go live on GitHub Pages shortly.

## Suggested next production upgrades

- Replace sample fund data with real category-wise dataset
- Add overlap analysis and fund comparison drawer
- Add CSV import for existing holdings
- Add Monte Carlo simulation and tax-aware rebalancing
- Add separate simple mode and advanced mode

Created for Kalpesh Dave.
