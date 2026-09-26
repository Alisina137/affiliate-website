# Affiliate — Project State

## Current phase
Phase 4 — Analysis Engine & Explainable Scoring

## Baseline
Affiliate contains the existing publishing/CMS platform plus an isolated Affiliate Content & Monetization Optimizer SaaS area. Public CMS content remains separate from customer-owned optimizer projects and articles.

## Completed outcomes

### Phase 1 — Optimizer Foundation
- User-owned optimizer projects and protected dashboard/project routes.
- Dedicated OptimizerProject, OptimizerArticle, OptimizerAnalysis, OptimizerIssue, and OptimizerUsage models.
- Existing Auth.js/NextAuth and Prisma/PostgreSQL infrastructure reused.
- Server-side ownership filtering established.
- Project creation workflow and dashboard entry added.
- Vitest dependency versions aligned.

### Phase 2 — Article Ingestion & Management
- Create, list, read, edit, and delete optimizer articles inside owned projects.
- Source URL and/or manual pasted content.
- Target keyword, secondary keywords, country, and language.
- Server-side Zod validation and ownership checks.
- READY/PENDING_IMPORT states and usage tracking.
- Analysis data model aligned to the approved six category scores plus overall score.

### Phase 3 — Safe Article URL Extraction & Ingestion
- Authenticated article import endpoint with ownership enforcement.
- HTTP/HTTPS-only URL policy and credential-bearing URL rejection.
- DNS resolution with pinned public-address requests.
- Localhost/private/link-local/internal address blocking and redirect revalidation.
- Timeout, redirect-count, response-size, HTTP-status, and HTML content-type limits.
- Readable article/title extraction with manual-paste fallback.
- READY/IMPORT_FAILED state handling and import usage events.
- Import action in the article UI.
- Unit coverage for private/public address policy.
- Production build verified after Phase 3 fixes.

### Phase 4 — Analysis Engine & Explainable Scoring
- Deterministic baseline analyzer for SEO, Content Quality, Search Intent, Affiliate Optimization, Conversion, and Technical categories.
- Overall 0–100 score calculated from the six approved category scores.
- Evidence-backed issues with Critical/High/Medium/Low severity and recommended actions.
- Authenticated analysis API with ownership enforcement.
- Immutable analysis snapshots and persisted issue records.
- Latest-analysis dashboard with six score cards and prioritized recommendations.
- Analysis history with score change versus the previous analysis.
- Analyze Article action from the article detail page.
- Usage tracking for completed analyses.
- Unit coverage for score bounds and explainable weak-content issues.
- No paid/external AI required for baseline scoring; later AI assistance can augment recommendations without making baseline scores opaque.

## Optimizer routes
- /dashboard/optimizer
- /dashboard/optimizer/projects
- /dashboard/optimizer/projects/new
- /dashboard/optimizer/projects/[id]
- /dashboard/optimizer/projects/[id]/articles/new
- /dashboard/optimizer/projects/[id]/articles/[articleId]
- /dashboard/optimizer/projects/[id]/articles/[articleId]/analysis
- /dashboard/optimizer/projects/[id]/articles/[articleId]/history
- /api/optimizer/projects
- /api/optimizer/articles
- /api/optimizer/articles/[id]
- /api/optimizer/articles/[id]/import
- /api/optimizer/articles/[id]/analyze

## Architecture decisions
1. Preserve the legacy CMS Article model and existing publishing platform.
2. Keep optimizer customer data isolated in dedicated models.
3. Reuse existing authentication and PostgreSQL infrastructure.
4. Enforce ownership server-side on every optimizer read and mutation.
5. Keep URL extraction separate from persistence so manual input remains a reliable fallback.
6. Keep baseline scoring deterministic and explainable; AI may augment recommendations later.
7. Preserve each analysis as history rather than overwriting prior scores.
8. Continue the repository's existing Prisma workflow; do not invent migration history retroactively.

## Deferred to later phases
- AI provider abstraction and structured AI recommendations.
- Original → Suggested rewrite/optimization workflow.
- Billing, plans, credits, Stripe, and hard usage limits.
- Advanced SERP/competitor data.
- Exports/reporting.
- Admin optimizer analytics.

## Next phase
Phase 5 should implement the **AI-assisted optimization workflow**: provider abstraction, structured and validated recommendations/rewrites, Original → Suggested review, accept/reject controls, and optimization history without automatically overwriting source content.
