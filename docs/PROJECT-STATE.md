# Affiliate — Project State

## Current phase
Phase 6 — Plans, Usage Limits & Billing Foundations

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

### Phase 5 — AI-Assisted Optimization Workflow
- Dedicated optimizer AI provider contract, isolated from the legacy admin content generator.
- Zod-validated optimization operations and provider outputs.
- Development-safe deterministic provider so the workflow works without paid AI credentials.
- Rewrite, Expand, Simplify, SEO, CTA, and Persuasion operations.
- Original → Suggested comparison workspace with optional user instructions.
- Suggestions persist as SUGGESTED and never overwrite article content automatically.
- Explicit Accept applies the suggested content; Reject preserves the article; both decisions remain in history.
- Ownership checks protect optimization creation, history, and decisions.
- Optimization usage events and provider/model metadata are persisted.
- Prompt-safety builder treats article text as untrusted data and prohibits fabricated metrics/claims for future remote providers.
- Provider contract unit coverage added.

### Phase 6 — Plans, Usage Limits & Billing Foundations
- Independent Free, Starter, Pro, and Agency optimizer plan catalog with approved monthly limits.
- Server-side project, analysis, and AI optimization entitlement checks.
- Free plan works without a payment provider; paid entitlements are represented by an isolated optimizer subscription model.
- Authenticated usage-summary API and Plan & Usage dashboard.
- Usage is measured from persisted optimizer usage events within the active subscription period or UTC calendar month for Free.
- Billing UI does not fake checkout: paid checkout remains disabled until a payment provider is configured.
- No bundle discounts, shared credits, coupons, or cross-module subscriptions introduced.
- Unit coverage for approved plan limits.
- Existing lowercase `settings` table was introspected and restored to the Prisma schema as `LegacySettings` with `@@map("settings")`, preserving its existing row during schema synchronization.

## Optimizer routes
- /dashboard/optimizer
- /dashboard/optimizer/billing
- /dashboard/optimizer/projects
- /dashboard/optimizer/projects/new
- /dashboard/optimizer/projects/[id]
- /dashboard/optimizer/projects/[id]/articles/new
- /dashboard/optimizer/projects/[id]/articles/[articleId]
- /dashboard/optimizer/projects/[id]/articles/[articleId]/analysis
- /dashboard/optimizer/projects/[id]/articles/[articleId]/history
- /dashboard/optimizer/projects/[id]/articles/[articleId]/optimize
- /api/optimizer/usage
- /api/optimizer/projects
- /api/optimizer/articles
- /api/optimizer/articles/[id]
- /api/optimizer/articles/[id]/import
- /api/optimizer/articles/[id]/analyze
- /api/optimizer/articles/[id]/optimize
- /api/optimizer/articles/[id]/optimize/[optimizationId]

## Architecture decisions
1. Preserve the legacy CMS Article model and existing publishing platform.
2. Keep optimizer customer data isolated in dedicated models.
3. Reuse existing authentication and PostgreSQL infrastructure.
4. Enforce ownership server-side on every optimizer read and mutation.
5. Keep URL extraction separate from persistence so manual input remains a reliable fallback.
6. Keep baseline scoring deterministic and explainable; AI may augment recommendations later.
7. Preserve each analysis as history rather than overwriting prior scores.
8. Continue the repository's existing Prisma workflow; do not invent migration history retroactively.
9. Keep optimizer AI behind a provider interface and validate structured output before persistence.
10. Never apply generated content until the user explicitly accepts a stored suggestion.

## Deferred to later phases
- Live payment checkout, webhook synchronization, and customer billing portal after a payment provider is configured.
- Advanced SERP/competitor data.
- Exports/reporting.
- Admin optimizer analytics.

## Next phase
Phase 7 should add **production payment-provider integration and subscription lifecycle synchronization** only after provider credentials/products are available.
