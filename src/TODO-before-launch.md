# Before launch: things to fill in

Search each page for `[` to find placeholders in the visible text.

## Pricing (`pricing.html`, `index.html`)
- [x] Real prices: **No Prefix = $0.50/mo, Plus = $2.99/mo, Pro = $5.99/mo.** Configured across `pricing.html` and `index.html`.
- [x] Plan names and tiers: Free ($0), No Prefix ($0.50), Plus ($2.99), Pro ($5.99).
- [ ] Checkout links: `CHECKOUT.noprefix`, `CHECKOUT.plus`, and `CHECKOUT.pro` in `pricing.html` currently point to Discord. **Set these to your real payment links when ready.**
- [x] Confirm which features belong to Free, No Prefix, Plus, and Pro (`FEATS` array in `pricing.html`). Implemented final distribution: Free = High-Retention Core (Mod, AutoMod, Anti-Raid, Economy & Casino, msglb/vclb leaderboards, Welcome cards, Tickets, Family), No Prefix = Individual User ($0.50), Plus = Server Atmosphere ($2.99, entire music suite, Spotify remote, bot avatar/banner bp, Anti-Nuke, Trapwire, Booster roles), Pro = High-End Intel & Auto ($5.99, Server Brain AI, Generative AI, Canvas ServerStats, Invite Audit, Role Aliases, Live counters, Scrapbook).
- [x] Reconcile with `docs.html` (Donator perks) and `faq.html` (what is free). Done — all tiers match across all pages.

## Changelog (`changelog.html`)
- [ ] Replace the six sample releases and their `[DATE]` values (`RELEASES` array).

## Terms and Privacy (`legal.html`)
- [ ] Replace every `[BRACKET]` in the `DOCS` array with your real details.
- [ ] Set the real "Last updated" date and `[CONTACT EMAIL]`.
- [ ] Have a lawyer review the wording. It is a template, not legal advice.

## Site-wide
- [ ] Favicon: pages reference `logo.png`. Make sure it is served from the site root (in a Vite project, put it in `public/`).
- [ ] Open Graph: pages have title and description tags but no preview image. Add `og:image` when you have one.
- [ ] Vite: copy `vite.config.example.js` to `vite.config.js` and keep all pages inside `src/`.
- [ ] 404: GitHub Pages serves `404.html` from the site root automatically.
- [x] Commands: verified and updated against the bot's actual source code. Added marriage, roleplay (23 actions), scrapbook, security/trapwire, spotify integration, profile subcommands, builder, snipe subcommands, runcode. Removed owner-only developer commands (noprefix, removenoprefix).
- [x] Docs: added Trapwire, Marriage & Family, Reputation, Roleplay Actions, Scrapbook, Games & Fun, Spotify Integration sections. Expanded music with all commands. Updated donator perks for No Prefix, Plus, and Pro tiers.
