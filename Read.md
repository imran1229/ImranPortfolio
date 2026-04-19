# Creative Vision Studio

## What This Project Is

A personal portfolio website for **Mohammed Imran Ahmed** — a freelance creative specializing in Graphic Design, Video Editing, and Motion Design. The site showcases his work, services, and contact information.

---

## Project Structure

This is a **pnpm monorepo** (TypeScript, Node 24) with the following packages:

```
Creative-Vision-Studio/
├── artifacts/
│   ├── portfolio/        # React + Vite frontend (the main portfolio website)
│   ├── api-server/       # Express 5 backend API
│   └── mockup-sandbox/   # Mockup preview tool
├── lib/
│   ├── api-client-react/ # Auto-generated React Query hooks (via Orval)
│   ├── api-spec/         # OpenAPI specification
│   ├── api-zod/          # Zod validation schemas
│   └── db/               # PostgreSQL + Drizzle ORM database layer
```

---

## Portfolio Website Sections

1. **Hero** — Full-screen animated intro with "MOHAMMED IMRAN" in large display type
2. **Services Ticker** — Scrolling marquee of services (Graphic Design, Brand Identity, Video Editing, Motion Graphics)
3. **Selected Work** — Video editing showcase with fast-paced edits and freelance client reels (linked to Instagram/f.io)
4. **Social Presence** — Instagram pages managed by Mohammed (@acs_shoutouts, @aanya.biz, @zurihassan.ai, etc.)
5. **Design Portfolio** — Thumbnails, posters, logo designs (linked to Google Drive)
6. **Services** — Graphic Design · Video Editing · Motion Design
7. **Toolkit** — Tools: Adobe Premiere Pro, After Effects, Photoshop, DaVinci Resolve, Figma / AI Tools: Claude, Gemini, Higgsfield, Heygen, ElevenLabs
8. **About** — B.Tech CSE 2025 graduate, currently at Growth School, available for freelance worldwide
9. **Contact** — mdimran19181@gmail.com · +91-6362013676

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, shadcn/ui (Radix UI) |
| Routing | Wouter |
| State/Data | TanStack React Query |
| Backend | Express 5, Pino logger |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod v4, drizzle-zod |
| API Codegen | Orval (OpenAPI → React Query hooks) |
| Monorepo | pnpm workspaces |
| Language | TypeScript 5.9 |

---

## Key Commands

```bash
# Install dependencies
pnpm install

# Run the portfolio frontend locally
pnpm --filter @workspace/portfolio run dev

# Run the API server locally
pnpm --filter @workspace/api-server run dev

# Full typecheck across all packages
pnpm run typecheck

# Build everything
pnpm run build

# Regenerate API hooks from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes (dev only)
pnpm --filter @workspace/db run push
```

---

## About Mohammed Imran Ahmed

- B.Tech CSE graduate (2025)
- Currently creating content at **Growth School**
- Available for **freelance projects worldwide**
- Contact: mdimran19181@gmail.com | +91-6362013676
