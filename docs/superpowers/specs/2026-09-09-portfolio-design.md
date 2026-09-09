# Software Developer Portfolio — Design Spec

**Date:** 2026-09-09  
**Project:** 2026_portfolio  
**Hosting:** Vercel (`jesus-flores-projects/2026-portfolio`)  
**CMS:** Sanity (`u36lq2cd` / `production`) — sole content source of truth  

## Goals

Build a responsive software-developer portfolio as a single-page scroll experience with section anchors, Sanity-backed content, shadcn UI, wood/navy branding, Zod contact form, and (Phase 2) an in-page AI chat agent that answers only from Sanity data.

## Phasing

### Phase 1 — Portfolio shell + contact (this plan)

- Sticky Sanity-driven navigation with smooth `#` scrolling
- Sections: Hero (`#home`), About, Projects, Skills, Blog, Contact
- Detail routes: `/projects/[slug]`, `/blog/[slug]`
- Contact form → Sanity `contactMessage`
- Layered architecture + type-safe Sanity data access
- Clerk remains decorative (display only; no content gating)

### Phase 2 — In-page chat agent (after Phase 1)

- Vercel AI SDK + OpenAI
- Server route loads Sanity context only
- System prompt rejects off-topic / jailbreak attempts
- Floating chat UI (shadcn)

## Decisions locked

| Topic | Choice |
|-------|--------|
| Delivery | Phase 1 first, then chat |
| Architecture | Approach 1 — single-page shell + section components |
| Availability UI | Soft pill overlay on portrait (About) |
| Skills UI | Category tabs + skill badges |
| Blog reading | Cards on `#blog` → `/blog/[slug]` Portable Text |
| Home | Compact `#home` hero, then separate `#about` |
| Styling | Tailwind + shadcn semantic tokens; wood/navy theme |
| Data gaps | Tolerant empty UI; content filled via Studio |

## Architecture (horizontal layers)

| Layer | Location | Responsibility |
|-------|----------|----------------|
| UI / routing | `app/` | Compose pages; call lib; pass typed props |
| Sections | `components/sections/` | Hero, About, Projects, Skills, Blog, Contact |
| Shared chrome | `components/nav/`, etc. | Header, tech overflow, socials |
| UI primitives | `components/ui/` | shadcn |
| Validations | `lib/validations/` | Zod schemas |
| Data access | `lib/sanity/` | Fetch/mutation helpers only |
| Queries | `sanity/lib/queries.ts` | `defineQuery` strings |
| Client / live | `sanity/lib/` | `client`, `live`, `env` |

### Data-access pattern

```
app/page.tsx
  → lib/sanity/getPortfolioPage.ts
  → lib/sanity/getProfile.ts | getProjects.ts | getSkills.ts | getBlogPosts.ts | getNavigation.ts
  → sanity/lib/live.ts (sanityFetch) + sanity/lib/queries.ts
```

### Rules

- No GROQ in components/sections
- Sections are presentational (typed props in → JSX out)
- Keep files small; one responsibility per module
- Prefer TypeGen-inferred types; no `any` on the Sanity path
- Contact: `app/api/contact/route.ts` → `lib/sanity/createContactMessage.ts`

## Type safety

- `defineQuery` + Sanity TypeGen (`sanity.types.ts`) for read results
- Shared Zod schema for contact (client + API)
- Typed section props derived from query results or narrow view-models
- Optional/missing Sanity fields → empty UI, not runtime crashes

## Page composition & UX

1. **Sticky nav** — Sanity `navigation.links` sorted by `order`; smooth scroll for anchors; external links respect `openInNewTab`; Tabler icon names from CMS where present; Clerk controls decorative
2. **`#home` Hero** — full name, headline, CTAs to Projects / Contact
3. **`#about`** — portrait + availability overlay, short bio, full bio (Portable Text), social links
4. **`#projects`** — cards (title, tagline, category, live/github). Technologies: show 4; if more, `+N` hover/focus popover for remainder. Zero technologies → omit chips
5. **`#skills`** — Tabs by category + Badge list
6. **`#blog`** — cards linking to `/blog/[slug]`; empty → shadcn Empty state
7. **`#contact`** — email, phone, location, Follow Me socials, Zod form

**Detail routes:** existing `/projects/[slug]` aligned to current schema; new `/blog/[slug]` with Portable Text.

**Motion:** CSS smooth scrolling + light, calm section presence (not noisy).

## Visual system (wood + navy)

| Role | Direction |
|------|-----------|
| Background | Warm wood-tinted cream / oak wash |
| Foreground | Deep charcoal-navy |
| Primary | Navy / ink blue |
| Accent | Walnut / amber-brown |
| Muted | Soft taupe-wood |
| Cards | Warm surface + subtle border (interaction containers) |

- Tokens via CSS variables mapped to shadcn semantics (`primary`, `accent`, etc.)
- Expressive display + readable body fonts (avoid Inter/Roboto/Arial defaults)
- Phase 1 ships polished **light** wood/navy; dark mode later if desired
- Images via Sanity + `next/image` (hotspot-aware URLs)

## Contact API

1. Client form validated with Zod  
2. `POST /api/contact` re-validates server-side  
3. Creates Sanity `contactMessage` visible in Studio  
4. Success toast / field errors  

**Env (Vercel):** existing `NEXT_PUBLIC_SANITY_*` + `SANITY_API_READ_TOKEN`; add **`SANITY_API_WRITE_TOKEN`** (server-only) for contact creates.

## Git / delivery discipline

- Commit and push to GitHub **between major changes and between phases**
- Phase 1 complete → commit/push before starting Phase 2 chat agent

## Out of scope (Phase 1)

- Chat agent / AI SDK wiring
- Dark mode
- Content migrations for legacy field names
- Analytics

## Sanity content note

Portfolio UI relies entirely on Studio content. Missing fields (e.g. project technologies, full bio, blog posts) are handled gracefully until added in Sanity.
