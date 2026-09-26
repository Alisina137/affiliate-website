# Affiliate — Project State

## Current phase
Phase 4 — Analysis Engine & Explainable Scoring

## Baseline
The repository contains the existing affiliate publishing/CMS platform plus the isolated Affiliate optimizer SaaS foundation from Phase 1. Existing public content, products, categories, affiliate links, admin tools, analytics, authentication, AI content infrastructure, tests, and deployment workflows remain preserved.

## Product direction
Affiliate is a modular platform. The current implementation area is the **Affiliate Content & Monetization Optimizer**, kept isolated from the legacy publishing Article model so customer-owned optimizer data does not collide with public CMS content.

## Completed outcomes

### Phase 1 — Optimizer Foundation
- User-owned optimizer projects.
- Dedicated optimizer article, analysis, issue, and usage models.
- Protected optimizer dashboard and project routes.
- Auth.js/NextAuth and Prisma/PostgreSQL reused.
- Server-side ownership filters established for optimizer data.
- Project creation workflow added.
- Vitest dependency versions aligned so installs resolve correctly.

### Phase 2 — Article Ingestion & Management
- Create optimizer articles inside owned projects.
- Support source URL and/or pasted article content.
- Target keyword, secondary keywords, country, and language fields.
- Article list, detail, edit, and delete flows.
- Server-side Zod validation.
- Ownership checks on list/read/update/delete operations.
- Transactional article creation with optimizer usage tracking.
- Article states distinguish ready pasted content from URL-only records pending later extraction.
- Approved analysis scoring schema aligned to SEO, Content Quality, Search Intent, Affiliate Optimization, Conversion, Technical, and Overall scores.

## Data models
- OptimizerProject
- OptimizerArticle
- OptimizerAnalysis
- OptimizerIssue
- OptimizerUsage

## Optimizer routes
- /dashboard/optimizer
- /dashboard/optimizer/projects
- /dashboard/optimizer/projects/new
- /dashboard/optimizer/projects/[id]
- /dashboard/optimizer/projects/[id]/articles/new
- /dashboard/optimizer/projects/[id]/articles/[articleId]
- /api/optimizer/projects
- /api/optimizer/articles
- /api/optimizer/articles/[id]

## Architecture decisions
1. Preserve the legacy CMS Article model.
2. Keep optimizer data in dedicated models.
3. Reuse existing authentication and PostgreSQL infrastructure.
4. Enforce user ownership server-side on every optimizer query and mutation.
5. URL extraction remains separate from raw article persistence so blocked sites can later fall back to manual paste.
6. No paid external research or AI provider is required for Phases 1–2.
7. Continue the repository's existing Prisma workflow; no migration history is invented retroactively.

## Verification requirements
After pulling the latest main branch:
- install dependencies;
- generate Prisma Client;
- apply the current Prisma schema to the development database using the repository's existing database workflow;
- run lint/build and smoke-test project/article CRUD.

## Deferred to later phases
- Safe URL fetch/extraction pipeline with SSRF protections and manual fallback.
- Analysis engine and explainable scoring.
- AI provider abstraction and structured outputs.
- Rewrite/optimization workflow.
- Billing, plans, credits, Stripe, and hard usage limits.
- Exports/reporting.
- Admin optimizer analytics.

## Next phase
Phase 3 should implement **safe article URL extraction and ingestion**: HTTP/HTTPS-only fetches, private/internal address blocking, redirect/timeout/size/content-type limits, HTML parsing/main-content extraction, import status/error handling, and manual-paste fallback.
