# Friday Bot — Frontend

The marketing site and dashboard frontend for **Friday**, a free Discord bot with moderation, leveling, economy, AI, giveaways, and more.

**Stack:** React 19 · Vite 8 · React Router v7 · Deployed on Vercel

---

## Pages

| Route       | Component            | Description                  |
| ----------- | -------------------- | ---------------------------- |
| `/`         | `Landing.jsx`        | Marketing landing page       |
| `/commands` | `Commands.jsx`       | Full slash command reference |
| `/status`   | `Status.jsx`         | Bot uptime / status page     |
| `/updates`  | `Updates.jsx`        | Live commit feed from GitHub |
| `/privacy`  | `PrivacyPolicy.jsx`  | Privacy policy               |
| `/terms`    | `TermsOfService.jsx` | Terms of service             |

---

## Features Showcased

- **AutoMod & Moderation** — spam, caps, link, invite filters; custom blocklist with regex; auto-escalation rules
- **XP Leveling & Voice** — chat + voice XP, multipliers, milestone role rewards, leaderboards
- **Economy, Jobs & Games** — 24 careers across 4 pay tiers (`/work` pays 50–20,000 coins), hunting/fishing/digging, real-time stock market with 5× leverage, blackjack/roulette/slots
- **Tickets & Helpdesk** — persistent helpdesk panel, private threads, collaborators, HTML transcripts
- **Giveaways & Events** — timed giveaways with button entry, multi-winner draw, reroll, RSVP event cards
- **Smart Onboarding** — custom welcome messages, auto-assign roles, button-based reaction role menus
- **Alerts & Notifications** — YouTube upload and Twitch live stream alerts routed to any channel
- **Custom Commands** — plain-text or rich embed responses, managed from dashboard
- **Auditing & Logs** — deleted/edited messages, voice activity, per-moderator action stats
- **Utility Tools** — avatar lookup, polls, reminders, weather, Urban Dictionary, embed builder
- **AI (Gemini Flash)** — `/friday ask`, `/friday rewrite` (5 styles), `/friday summarize`

---

## Deployment

Deployed on **Vercel**. `vercel.json` configures:

- SPA rewrite: all routes → `index.html`
- Security headers: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`

---

## Related Repositories

- **Bot backend:** [ashutoshswamy/friday-discord-backend](https://github.com/ashutoshswamy/friday-discord-backend)
- **Frontend (this):** [ashutoshswamy/friday-discord-frontend](https://github.com/ashutoshswamy/friday-discord-frontend)
