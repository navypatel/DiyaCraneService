# 🏗️ Diya Crane Service

**Professional Crane Rental Operations — Valsad & South Gujarat**

A full-stack React + TypeScript web application for Diya Crane Service, a heavy equipment rental business operating HYDRA (mobile hydraulic) and FARANA (pick-and-carry) crane fleets across South Gujarat's industrial GIDC belts. Includes public-facing landing pages, service catalogs, project gallery, and a secure admin dashboard for managing operational logs, customer enquiries, and PDF report generation.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Admin Portal](#admin-portal)
- [Data Storage](#data-storage)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Gallery & Assets](#gallery--assets)
- [Fleet Specifications](#fleet-specifications)
- [Contact](#contact)

---

## 🧰 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI library |
| TypeScript | 5.8 | Type safety |
| Vite | 6.x | Build tool & dev server |
| React Router | 7.x | Client-side routing |
| Tailwind CSS | 4.x | Utility-first styling |
| Recharts | 3.x | Admin dashboard charts |
| jsPDF | 4.x | PDF report generation |
| Motion (Framer Motion) | 12.x | Animations |
| Lucide React | 0.x | Icon library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Express | 4.x | HTTP server & REST API |
| Google Sheets API | v4 | Primary data persistence |
| Google Auth (JWT) | — | Sheets API authentication |
| Vite dev server | — | Frontend middleware in dev |

### Infrastructure
- **Runtime:** Node.js 18+
- **Package Manager:** npm
- **Deployment:** Vercel (serverless-ready) or self-hosted
- **Dev Runner:** `tsx` (TypeScript execution)

---

## ✨ Features

### Public Website
- **Hero Section** — Dynamic landing with background image, CTA buttons, animated scroll indicator
- **Fleet Services** — Side-by-side HYDRA & FARANA service cards with capacity specs
- **Stats Bar** — Key metrics: 10+ years, 100+ projects, 99.9% punctuality, 24/7 support
- **Why Choose Us** — 6-pillar value proposition grid (safety, punctuality, certified operators, etc.)
- **Testimonials** — Auto-rotating carousel with star ratings, motion animations
- **Final CTA** — Bold call-to-action section for booking inquiries
- **Services Page** — Detailed fleet breakdown with features, breadcrumbs, and technical specs comparison
- **Service Detail Pages** — `/services/hydra` and `/services/farana` with specification tables, 6-step mobilization process, FAQ accordion, photo previews
- **About Page** — Company story, founder profile card, 5-step timeline, corporate values
- **Gallery** — Category-filtered grid (All / HYDRA / FARANA), lightbox modal with keyboard navigation
- **Contact Form** — Validated enquiry form with Indian phone number handling, Google Maps embed, direct WhatsApp/phone/email channels
- **Navigation** — Sticky scroll-aware navbar with mobile hamburger drawer (animated)
- **Footer** — 4-column layout with quick links, fleet specs, contact details, WhatsApp CTA
- **Scroll-to-Top** — Floating button with animation

### Admin Dashboard (Protected)
- **Login** — Secure cookie-based session authentication with IP-based rate limiting (5 attempts / 15 min)
- **Dashboard** — Stats cards (enquiries, entries, monthly ops, recent activity), Recharts bar chart (monthly HYDRA vs FARANA hours), fleet analytics insights panel, recent enquiries table, operator quick actions
- **Add Entry** — Full form with: project name, service type toggle, crane number (preset dropdown + custom), client name/company (preset + custom), location, date, shift start/end times (auto-calculates duration), billing amount, notes
- **History & Records** — Dual-tab interface:
  - **Fleet Operation Logs** — Sortable/searchable/filterable table with edit modal, pagination, select-export-to-PDF, printable report view
  - **Customer Inbox** — Sortable/searchable/filterable table with inline status change dropdown, delete action
- **Edit Entry Modal** — Slide-in form with full field editing, save/delete confirmation
- **PDF Exporter** — Generates branded A4 PDF with black/yellow header, grid layout, footer
- **Printable Report** — CSS `@media print` optimized view for paper output

### Data Persistence
- **Primary:** Google Sheets (via API) — Entries and Enquiries stored in separate sheets
- **Fallback:** Local `server_db.json` with seed data (4 entries, 3 enquiries)
- **Sync:** Write-through caching with 3-second TTL to prevent API rate exhaustion
- **Schema Migration:** Auto-upgrades records missing new fields on read

---

## 📁 Project Structure

```
diya-crane-service/
├── api/
│   └── index.ts              # Vercel serverless entry point (re-exports Express app)
├── assets/                   # Static assets (for vercel deployment)
├── src/
│   ├── App.tsx               # Root component: routing, auth state, layout
│   ├── main.tsx              # React DOM entry point
│   ├── index.css             # Tailwind imports, theme variables, print styles
│   ├── types.ts              # TypeScript interfaces: EntryRecord, EnquiryRecord, UserSession, DashboardStats
│   │
│   ├── lib/
│   │   └── constants.ts      # Brand colors, nav links, service details, FAQ, testimonials, gallery categories, seed data
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Sticky nav with scroll detection, logo, links, admin indicator
│   │   │   ├── MobileMenu.tsx     # Animated full-screen mobile drawer
│   │   │   ├── Footer.tsx         # 4-column footer: brand, nav, fleet, contact
│   │   │   └── ScrollTop.tsx      # Floating back-to-top button
│   │   │
│   │   ├── home/
│   │   │   ├── Hero.tsx           # Landing hero with background image, CTAs, scroll indicator
│   │   │   ├── Services.tsx       # Fleet service cards (HYDRA/FARANA) with image overlays
│   │   │   ├── StatsBar.tsx       # 4-column trust metrics
│   │   │   ├── WhyChooseUs.tsx    # 6-card value proposition grid
│   │   │   ├── Testimonials.tsx   # Auto-rotating carousel with motion animation
│   │   │   └── FinalCTA.tsx       # Bottom call-to-action section
│   │   │
│   │   ├── gallery/
│   │   │   ├── CategoryTabs.tsx   # All / HYDRA / FARANA filter tabs
│   │   │   ├── GalleryGrid.tsx    # Image grid with hover zoom, error fallback SVGs
│   │   │   └── ImageModal.tsx     # Full-screen lightbox with keyboard nav
│   │   │
│   │   ├── forms/
│   │   │   └── ContactForm.tsx    # Validated enquiry form with Indian phone regex, URL param prefill
│   │   │
│   │   ├── admin/
│   │   │   ├── ProtectedRoute.tsx # Auth guard component
│   │   │   ├── StatsCard.tsx      # Metric display card with icon, badge, accent bar
│   │   │   ├── HistoryTable.tsx   # Dual-mode table: entries/enquiries with search, sort, filter, pagination, selection
│   │   │   ├── EditEntryModal.tsx # Slide-in edit form with full field editing and delete confirmation
│   │   │   ├── PDFExporter.tsx    # jsPDF document generator with branded header
│   │   │   └── PrintableReport.tsx # CSS print-optimized report table
│   │   │
│   │   └── common/
│   │       ├── Toast.tsx          # Animated notification component (success/error/warning/info)
│   │       ├── LoadingState.tsx   # Centered spinner with message
│   │       └── ErrorState.tsx     # Error display with retry button
│   │
│   ├── pages/
│   │   ├── Home.tsx          # Assembles Hero, Services, StatsBar, WhyChooseUs, Testimonials, FinalCTA
│   │   ├── Services.tsx      # Fleet overview with detailed cards, breadcrumbs, enquiry CTA
│   │   ├── ServiceDetail.tsx # Individual fleet spec (HYDRA/FARANA), process steps, FAQ, gallery preview
│   │   ├── About.tsx         # Company story, timeline, values, founder card
│   │   ├── Gallery.tsx       # Image grid with category filtering and lightbox
│   │   ├── Contact.tsx       # Contact form + info cards + Google Maps embed
│   │   └── admin/
│   │       ├── Login.tsx     # Secure login form with rate limiting feedback
│   │       ├── Dashboard.tsx # Stats, charts, recent enquiries, quick actions
│   │       ├── AddEntry.tsx  # Crane operation record form
│   │       └── History.tsx   # Tabs for entries and enquiries with data tables
│   │
│   └── assets/images/        # Crane fleet photos (HYDRA, FARANA, fleet road, DCSO, etc.)
│
├── server.ts                 # Express server: auth, CRUD APIs, Google Sheets sync, Vite middleware
├── vite.config.ts            # Vite config: React plugin, Tailwind CSS, path aliases
├── tsconfig.json             # TypeScript configuration with path aliases
├── vercel.json               # Vercel deployment rewrites and routing
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
├── metadata.json             # Project metadata
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (includes npm)
- **Git** (for version control)

### Installation

```bash
# Clone the repository
git clone https://github.com/navypatel/DiyaCraneService.git
cd DiyaCraneService

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Configuration

Copy the example environment file and fill in values:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) for details.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Express + Vite middleware) |
| `npm run build` | Build frontend (Vite) + compile server (esbuild) |
| `npm run start` | Run compiled production server from `dist/` |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Remove build artifacts |

---

## 🔌 API Endpoints

### Health & Session
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | No | Server health check |
| GET | `/api/auth/session` | No | Get current admin session status |
| POST | `/api/auth/login` | No | Admin login (creates session cookie) |
| POST | `/api/auth/logout` | No | Clear admin session |

### Public
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/sheets/submit-enquiry` | No | Submit contact form enquiry |

### Admin (Protected — requires session cookie)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/admin/stats` | Yes | Dashboard statistics (counts, recent enquiries) |
| GET | `/api/sheets/get-entries` | Yes | List operation entries (with filter & search) |
| GET | `/api/sheets/get-enquiries` | Yes | List customer enquiries (with filter & search) |
| POST | `/api/sheets/add-entry` | Yes | Add new crane operation record |
| PATCH | `/api/sheets/update-entry` | Yes | Update existing entry |
| DELETE | `/api/sheets/delete-entry` | Yes | Soft-delete an entry (sets status to 'Deleted') |
| PATCH | `/api/sheets/update-entry-status` | Yes | Update enquiry status (New → In Progress → Closed) |
| DELETE | `/api/sheets/delete-enquiry` | Yes | Permanently delete an enquiry |

---

## 🔐 Admin Portal

### Access
- **URL:** `/admin/login`
- **Default Credentials:**
  - Username: `dataentry`
  - Password: `dcs1234`

### Security
- Cookie-based session (`dcs_admin_session`) valid for 7 days
- IP-based rate limiting: max 5 failed login attempts per 15 minutes
- All admin routes guarded by `requireAdmin` middleware
- Frontend `ProtectedRoute` component redirects unauthenticated users

### Features Available
1. **Dashboard** — Numerical stats, stacked bar chart (monthly HYDRA/FARANA hours), fleet analytics insights, recent enquiries
2. **Add Entry** — Log new crane operations with preset/ custom fields for clients, companies, crane numbers
3. **History** — Browse, search, sort, filter, edit, and delete entries; manage enquiry statuses; export selected rows as PDF; print reports

---

## 💾 Data Storage

### Primary: Google Sheets
- **Authentication:** Service account with JWT (configured via `GOOGLE_SHEETS_KEY`)
- **Sheets Used:** `Entries` (columns A–P) and `Enquiries` (columns A–H)
- **Operation:** Full overwrite on each write (clear + update) for consistency
- **Self-healing:** Auto-creates sheets and seeds default data if they don't exist

### Fallback: Local JSON
- **File:** `server_db.json` (in project root or `/tmp/` on Vercel)
- **Seed Data:** 4 operation entries and 3 enquiries pre-loaded
- **Auto-migration:** Missing fields (`clientCompanyName`, `shiftEndTime`, `craneNumber`) are populated on read

### Caching
- In-memory cache with 3-second TTL reduces Google Sheets API calls during rapid client operations
- Write-through: every mutation updates both cache and persistence layer

---

## 🚢 Deployment

### Vercel (Recommended)
The project is pre-configured for Vercel deployment:
- `vercel.json` rewrites API routes to `api/index.ts` and static routes to `index.html`
- Serverless environment uses `/tmp/server_db.json` for writable storage
- Google Sheets integration works in serverless if credentials are provided

```bash
# Deploy to Vercel
npx vercel --prod
```

### Environment Variables (Required for Vercel)
Set these in Vercel dashboard:
- `GOOGLE_SHEETS_KEY` — Full JSON service account key
- `GOOGLE_SHEETS_ID` — Google Sheets spreadsheet ID

### Self-Hosted
```bash
npm run build
npm run start
```

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_SHEETS_KEY` | No* | Full JSON string of Google service account credentials |
| `GOOGLE_SHEETS_ID` | No* | Google Sheets spreadsheet ID (from sheet URL) |
| `DISABLE_HMR` | No | Set to `true` to disable Vite HMR (useful in AI Studio) |

*\*If not provided, the app falls back to local `server_db.json` storage.*

### Google Sheets Setup
1. Create a Google Cloud project and enable the Google Sheets API
2. Create a service account and download the JSON key
3. Share your Google Sheet with the service account email (Editor role)
4. Copy the spreadsheet ID from the sheet URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

---

## 🖼️ Gallery & Assets

All project images are stored in `src/assets/images/`:

| File | Description |
|------|-------------|
| `crane_logo_1781694287869.jpg` | Logo used in navbar and footer |
| `crane_green_f270_1781700221950.jpg` | FARANA crane on site |
| `crane_orange_15xw_1781700235890.jpg` | HYDRA crane in operation |
| `fleet_crane_road_1781700201838.jpg` | Fleet crane on road (hero background) |
| `cranes.jpg` | Multi-crane coordination |
| `DCSO.jpg` | Founder/owner portrait |
| `Farana.png` | FARANA series illustration |
| `Hydra.png` | HYDRA series illustration |

Images are imported directly in components (`import craneOrange from '../assets/images/...'`) for Vite asset hashing.

---

## 🚛 Fleet Specifications

### HYDRA Crane Series (12T – 18T)
| Spec | Value |
|------|-------|
| Capacity | 12 to 18 tons |
| Max Height | 55 feet |
| Horizontal Reach | 45 feet |
| Best For | Factory maintenance, confined spaces, pipeline shifts |
| Features | Articulating chassis, multi-stage boom, 360° stabilizers |

### FARANA Crane Series (15T – 25T)
| Spec | Value |
|------|-------|
| Capacity | 15 to 25 tons |
| Max Height | 70 feet |
| Horizontal Reach | 58 feet |
| Best For | Steel erection, girder slabs, heavy cargo transport |
| Features | Pick & Carry capability, SLI indicators, rear-wheel steering |

---

## 📞 Contact

- **Phone:** +91 98249 96999 (24/7 Dispatch)
- **WhatsApp:** [Chat on WhatsApp](https://wa.me/919824996999)
- **Email:** info@diyacraneservice.com
- **Address:** Chanvai road, near Ambaji tample, Parnera, Gujarat 396020
- **Service Area:** Valsad, Vapi, Pardi, Gundlav, and all South Gujarat GIDC belts

---

## 📄 License

All rights reserved. This project is proprietary software owned by Diya Crane Service.

---

*Built with React 19, TypeScript, Express, Tailwind CSS 4, and Google Sheets API. Deployed on Vercel.*
