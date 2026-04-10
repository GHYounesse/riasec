# RIASEC · AI — Career Orientation Game
 
A swipe-based career orientation assessment built with **React + TypeScript**, powered by **Supabase** and AI-generated imagery. Users swipe through situational cards to discover their [RIASEC personality profile](https://en.wikipedia.org/wiki/Holland_Codes) and top career matches.
 
---
 
## What is RIASEC?
 
RIASEC is a career interest model developed by John Holland. It classifies personalities into 6 types:
 
| Code | Type | Description |
|------|------|-------------|
| R | Réaliste | Working with hands, tools, machines, outdoors |
| I | Investigateur | Analyzing, researching, solving complex problems |
| A | Artistique | Creating, expressing — arts, music, design, writing |
| S | Social | Helping, teaching, counseling, caring for others |
| E | Entreprenant | Leading, persuading, selling, managing |
| C | Conventionnel | Organizing, managing data, following procedures |
 
---
 
## Features
 
- **Tinder-style swipe cards** — drag, button, or keyboard (← →) to like/pass situations
- **AI-generated imagery** — local images with Pollinations.ai fallback
- **Real-time scoring** — per-type affinity scores updated on every swipe
- **Radar chart results** — visual breakdown of your RIASEC profile
- **Behavioral analytics** — view duration, hesitation time, swipe method tracked per card
- **Session persistence** — Supabase-backed sessions, results, and event history
- **Offline resilience** — failed beacon payloads saved to `localStorage` and retried on next load
- **Batched telemetry** — swipe events sent in batches of 5, or every 10 seconds, via `sendBeacon`
- **Pause-aware timing** — tab visibility changes are subtracted from view duration
 
---
 
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Database | Supabase (PostgreSQL) |
| Images | Local `/riasec_images/` + [Pollinations.ai](https://pollinations.ai) fallback |
| Analytics | Custom beacon API (`POST /api/batch`) |
| Styling | Inline CSS (dark luxury design system) |
| Fonts | DM Sans, Syne (Google Fonts) |
 
---
