# Diya Crane Service — README

> Professional crane & heavy-lift solutions across South Gujarat. Hydra, Farana, and high-capacity mobile cranes for construction, infrastructure, and industrial sites.

[![Live](https://img.shields.io/badge/Live-DiyaCraneService.com-ee2a2a?style=for-the-badge)](https://diyacraneservice.com)
[![Region](https://img.shields.io/badge/Region-South%20Gujarat-1a1a1a?style=for-the-badge)](#service-area)
[![Phone](https://img.shields.io/badge/Call-%2B91%2098249%2096999-22c55e?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/919824996999)

A production-grade marketing & operations website for **Diya Crane Service** — a crane rental company based in Parnera (Valsad), Gujarat, serving all of South Gujarat. Built as a single-page experience with a custom Node/Express API powering the contact form, quote calculator, and PDF/printable report generation.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Pages & Components](#pages--components)
6. [Brand & Design System](#brand--design-system)
7. [Backend API](#backend-api)
8. [Environment Variables](#environment-variables)
9. [Local Development](#local-development)
10. [Build & Deploy](#build--deploy)
11. [Service Area](#service-area)
12. [Contact](#contact)
13. [License](#license)

---

## Overview

Diya Crane Service provides mobile hydraulic crane rentals (Hydra cranes, Farana cranes, and high-capacity mobile rigs) to construction sites, infrastructure projects, factories, and industrial clients across South Gujarat.

This repository contains the company's primary web platform:

- A fast, SEO-friendly **React + Vite** single-page site with five main pages: Home, Services, Service Detail, About, and Contact.
- An integrated **quote calculator** with multi-step form, distance-based pricing, capacity tier selection, and PDF export.
- A **Node.js / Express** API that handles quote submissions, contact form intake, and server-side rendering of printable reports.
- A **branded design system** (custom colors, fonts, motion presets) and a **PDF/print report generator** for sharing quotes with clients offline.

The site is deployed to Vercel (frontend) and can run the Express server either as a Vercel serverless function (via pi/index.ts) or as a standalone Node process.

---

## Features

### Customer-facing

- **Hero with floating vehicles** — animated crane/vehicle imagery layered with a brand-red call-to-action and WhatsApp link.
- **Services grid** — Hydra cranes, Farana cranes, and high-capacity mobile cranes, each with detail pages.
- **Service Detail** with capacity profile, use-cases, FAQs, and a sticky quote CTA.
- **Multi-step Quote Calculator** — pick equipment, distance, duration, add-ons; live price preview; **PDF export** of the quote with a branded letterhead.
- **Gallery** with project photos.
- **About** page with company story, stats, owner/founder profile, and values.
- **Contact** page with phone, WhatsApp, email, and an embedded Google Map of the Parnera office.
- **Fully responsive** — mobile menu, fluid typography, touch-friendly CTAs.
- **Smooth scroll, sticky nav, scroll-reveal animations** powered by Framer Motion + IntersectionObserver.

### Operations

- **Quote submission API** — POST /api/quote validates payload, computes price, generates a server-side PDF, and returns the download link.
- **Contact form API** — POST /api/contact with field validation, spam protection, and email notification hook.
- **Printable report** — /print?ref=<id> renders a clean, printable quote summary styled for A4 paper.
- **PDF exporter** — server-side PDF generation with branding, contact block, and itemised pricing.

### Developer / SEO

- **Per-page meta tags** via eact-helmet-async (title, description, OpenGraph, Twitter cards).
- **Sitemap & robots** are emitted at build time.
- **Vercel rewrites** — clean URLs (/services, /about, /contact) without a server round-trip.
- **Strict TypeScript** end-to-end (frontend + backend).
- **Tailwind utility-first** styling with a custom brand theme.

---

## Tech Stack

| Layer            | Technology                                                                 |
|------------------|----------------------------------------------------------------------------|
| Frontend         | React 18, Vite 5, TypeScript, Tailwind CSS                                 |
| Animations       | Framer Motion                                                              |
| Routing          | React Router DOM v6 (with ercel.json rewrites for clean URLs)           |
| Icons            | lucide-react                                                               |
| Charts/UI        | Recharts (stats), Radix primitives                                         |
| Backend          | Node.js, Express 4, TypeScript                                             |
| PDF generation   | pdfkit                                                                     |
| Validation       | zod (request body)                                                         |
| Email            | nodemailer (optional, env-gated)                                           |
| Hosting          | Vercel (frontend + serverless API via pi/index.ts)                      |
| Dev tooling      | pnpm, tsx, esbuild, ESLint, Prettier                                       |

> Single dependency tree: the same package.json drives both the SPA and the Express API.

---

## Project Structure

`
diya-crane-service/
├── api/
│   └── index.ts                # Vercel serverless entry (wraps Express app)
├── public/                     # Static assets served as-is
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── images/             # Crane, fleet, logo, owner images
│   ├── components/
│   │   ├── About.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Navbar.tsx
│   │   ├── PDFExporter.tsx
│   │   ├── PrintLayout.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── ContactForm.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Stats.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CTABanner.tsx
│   │   └── service/
│   │       └── ServiceCard.tsx
│   ├── lib/
│   │   ├── api.ts              # Typed fetch helpers for the backend
│   │   ├── constants.ts        # Brand colors, contact info, service list
│   │   ├── pricing.ts          # Quote pricing logic
│   │   └── utils.ts            # cn(), formatters, helpers
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Services.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Gallery.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Tailwind layers + custom utilities
├── server.ts                   # Express app (used by pi/index.ts and locally)
├── vercel.json                 # Vercel rewrites + build config
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
`

---

## Pages & Components

### Pages

| Path           | Component        | Purpose                                                    |
|----------------|------------------|------------------------------------------------------------|
| /            | Home.tsx       | Hero, services grid, stats, testimonials, CTA banner       |
| /services    | Services.tsx   | Full fleet list with capacity profile and FAQs             |
| /services/:slug | ServiceDetail.tsx | Per-service detail with use-cases and quote CTA    |
| /about       | About.tsx      | Company story, values, founder/owner card                  |
| /contact     | Contact.tsx    | Contact info, map, and contact form                        |
| /gallery     | Gallery.tsx    | Project photos                                             |
| /print       | PrintLayout.tsx| A4-styled printable quote report                           |

### Key components

- Navbar.tsx / MobileMenu.tsx — responsive top nav with a hamburger drawer.
- Hero.tsx — full-bleed hero with floating vehicle SVGs and a dual CTA (Call + WhatsApp).
- Services.tsx (home) — 3-card grid that links to service detail pages.
- ContactForm.tsx — validated form posting to POST /api/contact.
- PDFExporter.tsx — client-side hook + server-side PDF generator using pdfkit.
- ScrollToTop.tsx — resets scroll on route change.

---

## Brand & Design System

- **Primary red:** #ee2a2a (used for CTAs, highlights, and brand mark).
- **Industrial black/gray** for headings and dark sections.
- **Custom display + mono fonts** loaded from Google Fonts.
- **Motion presets** in src/lib/constants.ts for entrance/slide animations.

All brand tokens live in 	ailwind.config.js and src/lib/constants.ts so the visual language can be retuned from a single place.

---

## Backend API

The Express server is defined in server.ts and exposed in two ways:

1. **Vercel serverless** via pi/index.ts.
2. **Standalone** via pnpm dev:server (or 	sx server.ts).

### Endpoints

| Method | Path             | Description                                          |
|--------|------------------|------------------------------------------------------|
| GET  | /api/health    | Liveness check — returns { ok: true }              |
| POST | /api/quote     | Validates a quote request, returns computed pricing  |
| POST | /api/contact   | Validates and forwards a contact form submission     |
| GET  | /api/pdf/:id   | Streams a generated PDF for a given quote id         |

Request bodies are validated with zod. Errors return JSON { error: string } with the appropriate 4xx status.

---

## Environment Variables

Create a .env (or configure these in your hosting provider):

`env
# Server
PORT=3001
NODE_ENV=development

# Email (optional — contact form notifications)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=

# Public site URL (used for OG tags and absolute links in PDFs)
SITE_URL=https://diyacraneservice.com
`

> All variables are read at runtime; missing email credentials simply skip outbound mail without breaking the request.

---

## Local Development

`ash
# 1. Install
pnpm install

# 2. Run the frontend (Vite dev server on :5173)
pnpm dev

# 3. In a second terminal, run the API (Express on :3001)
pnpm dev:server
`

The Vite dev server proxies /api/* to the Express server, so the frontend can call etch('/api/...') in both dev and production.

### Build

`ash
pnpm build          # type-checks + builds the SPA into ./dist
pnpm preview        # serves the built bundle locally
`

---

## Build & Deploy

The project is configured for **Vercel** out of the box:

- ercel.json defines clean-URL rewrites so /about, /services, etc. hit index.html.
- pi/index.ts wraps server.ts so the Express API runs as serverless functions.
- Build command: pnpm build (or ite build).
- Output: dist/.

Push to main and Vercel handles the rest. To deploy manually:

`ash
vercel --prod
`

---

## Service Area

Primary service area: **South Gujarat** — Valsad, Vapi, Navsari, Surat, Bharuch, Dang, and Tapi. Long-distance moves available on request. All quotes factor in km-based travel and on-site duration.

---

## Contact

- **Phone / WhatsApp:** [+91 98249 96999](https://wa.me/919824996999)
- **Email:** info@diyacraneservice.com
- **Address:** Chanvai road, near Ambaji tample, Parnera, Gujarat 396020
- **Owner / Operator:** DCSO — Diya Crane Service Operations

---

## License

© Diya Crane Service. All rights reserved. Source provided for the owner's deployment and maintenance. Not currently licensed for redistribution.

