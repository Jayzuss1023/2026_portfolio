# Phase 1 Portfolio Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Sanity-backed single-page portfolio (Hero → About → Projects → Skills → Blog → Contact) with typed `lib/sanity` data access, wood/navy shadcn theme, Zod contact form, and detail routes for projects/blog.

**Architecture:** Horizontal layers — `app/` composes; `components/sections/` render; `lib/sanity/` fetches/mutates; `sanity/lib/` holds client, live, and GROQ. No GROQ in UI. TypeGen + Zod for safety.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 4, shadcn (base-nova), next-sanity, Portable Text, Zod 4, Clerk (decorative), Vercel.

## Global Constraints

- Sanity project `u36lq2cd`, dataset `production` — sole content source of truth
- Tailwind + shadcn semantic tokens only (wood/navy via CSS variables); no purple/cream AI clichés
- Folder split: `app/` routing, `components/sections/` sections, `lib/sanity/` data access
- Type-safe: TypeGen query results + Zod for contact; no `any` on Sanity path
- Smooth `#` scrolling; responsive desktop + mobile
- Clerk is display-only (no content gating)
- Commit and push between major tasks / at phase end
- Phase 2 chat agent is out of scope

## File map

| Path | Role |
|------|------|
| `app/globals.css` | Wood/navy tokens |
| `app/layout.tsx` | Fonts, sticky shell, Toaster |
| `app/page.tsx` | Fetch portfolio page data; compose sections |
| `app/projects/[slug]/page.tsx` | Project detail |
| `app/blog/[slug]/page.tsx` | Blog detail (Portable Text) |
| `app/api/contact/route.ts` | Contact POST |
| `sanity/lib/queries.ts` | All `defineQuery` strings |
| `sanity/lib/image.ts` | `urlFor` helper |
| `lib/sanity/*.ts` | Typed fetch/mutation helpers |
| `lib/validations/contact.ts` | Zod contact schema |
| `lib/skill-categories.ts` | Category value → label map |
| `components/nav/site-header.tsx` | Sticky Sanity nav + Clerk chrome |
| `components/sections/*.tsx` | Hero, About, Projects, Skills, Blog, Contact |
| `components/portable-text.tsx` | Shared Portable Text renderer |
| `components/tech-overflow.tsx` | Show 4 skills + hover `+N` |
| `next.config.ts` | Sanity image remotePatterns |

---

### Task 1: Theme, fonts, shadcn primitives, image config

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`, `next.config.ts`
- Create via CLI: shadcn `card`, `badge`, `tabs`, `button` (exists), `input`, `textarea`, `field`, `separator`, `empty`, `popover`, `sonner`, `avatar`

**Interfaces:**
- Produces: themed CSS variables (`--primary` navy, `--accent` walnut, warm background); `Toaster` in layout; Sanity CDN in `images.remotePatterns`

- [ ] **Step 1: Install shadcn components**

```bash
pnpm dlx shadcn@latest add card badge tabs input textarea field separator empty popover sonner avatar -y
```

- [ ] **Step 2: Set wood/navy tokens in `app/globals.css`**

Map `:root` semantic colors to warm oak background, charcoal-navy foreground, navy primary, walnut accent. Keep shadcn `@theme inline` mappings. Add `html { scroll-behavior: smooth; }`.

- [ ] **Step 3: Update fonts in `app/layout.tsx`**

Use distinctive Google fonts (e.g. `Fraunces` display + `Source_Sans_3` body) via `next/font/google`. Avoid Inter/Roboto/Arial.

- [ ] **Step 4: Configure Sanity images in `next.config.ts`**

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.sanity.io' },
  ],
},
```

- [ ] **Step 5: Verify**

Run: `pnpm exec biome check app/globals.css next.config.ts`  
Expected: no errors on those files (or format fix)

- [ ] **Step 6: Commit + push**

```bash
git add app/globals.css app/layout.tsx next.config.ts components/ui package.json pnpm-lock.yaml
git commit -m "feat: wood-navy theme and shadcn primitives for portfolio shell"
git push
```

---

### Task 2: GROQ queries + typed `lib/sanity` data layer

**Files:**
- Modify: `sanity/lib/queries.ts`
- Create: `sanity/lib/image.ts`, `lib/sanity/getProfile.ts`, `getNavigation.ts`, `getProjects.ts`, `getSkills.ts`, `getBlogPosts.ts`, `getPortfolioPage.ts`, `getProjectBySlug.ts`, `getBlogPostBySlug.ts`, `createContactMessage.ts`, `lib/skill-categories.ts`, `lib/validations/contact.ts`

**Interfaces:**
- Consumes: `sanityFetch` from `@/sanity/lib/live`, `client` from `@/sanity/lib/client`
- Produces:
  - `getPortfolioPage(): Promise<{ profile, navigation, projects, skillsByCategory, blogPosts }>`
  - `getProjectBySlug(slug: string)`, `getBlogPostBySlug(slug: string)`
  - `createContactMessage(input: ContactInput): Promise<{ id: string }>`
  - `contactSchema` (Zod), `SKILL_CATEGORY_LABELS`

- [ ] **Step 1: Expand `sanity/lib/queries.ts`**

Add `PROFILE_QUERY`, `NAVIGATION_QUERY`, `SKILLS_QUERY`, `BLOG_POSTS_QUERY`, `BLOG_POST_QUERY`, `BLOG_SLUGS_QUERY`. Extend project queries to include `coverImage`, `liveUrl`, `githubUrl`, `body` as needed. Keep `defineQuery`.

- [ ] **Step 2: Add `sanity/lib/image.ts`**

```ts
import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from '@/sanity/env'

const builder = createImageUrlBuilder({ projectId, dataset })
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

- [ ] **Step 3: Implement one helper per resource under `lib/sanity/`**

Each file: call `sanityFetch` with the matching query; return typed `data`. `getSkills.ts` groups by `category`. `getPortfolioPage.ts` uses `Promise.all`.

- [ ] **Step 4: Zod contact schema**

```ts
import { z } from 'zod'
export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(5000),
})
export type ContactInput = z.infer<typeof contactSchema>
```

- [ ] **Step 5: `createContactMessage` (server-only)**

Use `createClient` with `token: process.env.SANITY_API_WRITE_TOKEN`, `useCdn: false`, create `{ _type: 'contactMessage', ...fields, submittedAt: new Date().toISOString() }`. Throw if token missing.

- [ ] **Step 6: Run TypeGen from studio**

```bash
pnpm --dir studio run typegen
```

Expected: queries found; `sanity.types.ts` updated

- [ ] **Step 7: Commit + push**

```bash
git commit -m "feat: typed Sanity data-access layer for portfolio page"
git push
```

---

### Task 3: Site header + section components + homepage composition

**Files:**
- Create: `components/nav/site-header.tsx`, `components/sections/hero-section.tsx`, `about-section.tsx`, `projects-section.tsx`, `skills-section.tsx`, `blog-section.tsx`, `contact-section.tsx`, `components/tech-overflow.tsx`, `components/portable-text.tsx`, `components/sections/contact-form.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx`

**Interfaces:**
- Consumes: `getPortfolioPage()` result types
- Produces: presentational sections with explicit props (no fetches inside sections)

- [ ] **Step 1: `SiteHeader`**

Sticky header; map `navigation.links` sorted by `order`; `#` links use `<a href>`; external use `target=_blank` when `openInNewTab`. Keep decorative Clerk controls.

- [ ] **Step 2: Sections**

- Hero `#home`: name, headline, CTAs to `#projects` / `#contact`
- About `#about`: portrait (`next/image` + `urlFor`), availability pill overlay, shortBio, Portable Text fullBio, socials
- Projects `#projects`: Card grid; `TechOverflow` (4 chips + popover)
- Skills `#skills`: Tabs by category + Badges
- Blog `#blog`: cards → `/blog/[slug]` or Empty
- Contact `#contact`: info + Follow Me + client `ContactForm`

- [ ] **Step 3: Wire `app/page.tsx`**

```tsx
const data = await getPortfolioPage()
return (
  <>
    <SiteHeader links={data.navigation?.links ?? []} />
    <main>
      <HeroSection profile={data.profile} />
      <AboutSection profile={data.profile} />
      {/* ... */}
    </main>
  </>
)
```

- [ ] **Step 4: Smoke check**

Run: `pnpm build` with Sanity env vars  
Expected: build succeeds; `/` generates

- [ ] **Step 5: Commit + push**

```bash
git commit -m "feat: portfolio sections and sticky Sanity navigation"
git push
```

---

### Task 4: Detail routes + contact API

**Files:**
- Modify: `app/projects/[slug]/page.tsx`
- Create: `app/blog/[slug]/page.tsx`, `app/api/contact/route.ts`

- [ ] **Step 1: Align project detail with `getProjectBySlug` + PortableText + cover image**

- [ ] **Step 2: Blog detail page**

`generateStaticParams` via slugs query; `generateMetadata` with `stega: false`; render Portable Text body; `notFound()` if missing.

- [ ] **Step 3: Contact API**

```ts
export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await req.json())
  if (!parsed.success) return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  const { id } = await createContactMessage(parsed.data)
  return Response.json({ ok: true, id })
}
```

- [ ] **Step 4: Contact form client** — Zod client check → POST → sonner toast

- [ ] **Step 5: Build verify + commit/push**

```bash
pnpm build
git commit -m "feat: blog detail route and Sanity contact form API"
git push
```

---

### Task 5: Phase 1 polish checkpoint

- [ ] **Step 1:** Mobile nav overflow (wrap or simple menu) if sticky links crowd small screens  
- [ ] **Step 2:** Empty states for zero projects / skills  
- [ ] **Step 3:** Document `SANITY_API_WRITE_TOKEN` in `.env.example`  
- [ ] **Step 4:** Final `pnpm build` + commit/push Phase 1 complete  

```bash
git commit -m "chore: Phase 1 portfolio polish and env example for write token"
git push
```

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Layered `lib/sanity` | 2 |
| Type safety TypeGen + Zod | 2, 4 |
| Hero / About / Projects / Skills / Blog / Contact | 3 |
| Tech overflow 4+hover | 3 |
| Skills tabs + badges | 3 |
| Blog empty + `/blog/[slug]` | 3, 4 |
| Contact → Sanity | 2, 4 |
| Wood/navy theme | 1 |
| Smooth scroll | 1 |
| Clerk decorative | 3 |
| Commit between majors | every task |
| Chat agent | Phase 2 (excluded) |
