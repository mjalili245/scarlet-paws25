# Scarlet Paws — Cat Rescue App

A community app for reporting and rescuing cats in **Rutgers New Brunswick**. Anyone can report cats in need; only verified **shelter members** see exact locations and coordinate rescues.

## Concept

- **Anyone** can upload a photo and report a cat (general area only).
- **Shelters & rescues** with a paid membership see exact locations and can claim/coordinate rescues.
- **Membership:** $5/month or $50/year (prepay).
- Reduces spam and organizes a system often done via Facebook/phone; gives shelters clarity (capacity, closest shelter, etc.).

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo login

- **Public user:** `demo@example.com` (any password) — can report cats, see areas only.
- **Shelter user:** use the header dropdown “Demo (Shelter)” or log in as `shelter@nbrescue.org` — can see **Rescues** and exact locations.

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero, how it works, recent reports (area only). |
| **Shelters & Rescues** | List and detail of partner shelters; capacity info. |
| **Report a cat** | Form to submit a sighting (photo placeholder, area, description). |
| **Rescues** | Shelter-only: list of cats with **exact locations**, claim rescue. |
| **Membership** | $5/month and $50/year options for shelters. |
| **Login** | Demo auth (no real backend). |

## Tech stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- In-memory store for MVP (replace with DB + real auth for production)
- Fonts: DM Sans (body), Fraunces (display)

## Possible next steps

- Database (e.g. Prisma + PostgreSQL/SQLite) for users, shelters, sightings.
- Real auth (e.g. NextAuth, Clerk) and shelter verification.
- File upload (e.g. S3/Cloudinary) for cat photos.
- Geolocation on report form; map view for shelter rescues.
- Stripe for $5/month and $50/year membership.
- Admin panel to verify shelters and moderate reports.
