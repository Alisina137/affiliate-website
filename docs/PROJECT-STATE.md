# Affiliate Website — Project State

## Current phase
Phase 1 — Affiliate Optimizer Foundation

## Baseline
The repository began this phase as an existing affiliate publishing/CMS platform. Existing public content, products, categories, affiliate links, admin tools, analytics, authentication, AI content infrastructure, tests, and deployment workflows are preserved.

## Product direction
A new authenticated SaaS area named **Affiliate Content & Monetization Optimizer** is being layered onto the existing platform. It is intentionally isolated from the legacy publishing Article model so user-owned optimizer content can evolve without breaking the CMS.

## Phase 1 scope
- User-owned optimizer projects.
- User-owned optimizer articles.
- Analysis records with separate SEO, content, affiliate, trust, and overall scores.
- Structured analysis issues with category, severity, suggestion, and evidence fields.
- Optimizer usage events for later plan/credit enforcement.
- Protected optimizer dashboard and project routes.
- Project creation API with Zod validation and ownership enforcement.
- No paid research/AI provider is required in Phase 1.

## Data models added
- OptimizerProject
- OptimizerArticle
- OptimizerAnalysis
- OptimizerIssue
- OptimizerUsage

All optimizer records are attached to an authenticated user directly or through an owned project/article. Destructive cascades are used only inside the optimizer hierarchy.

## Routes added
- /dashboard/optimizer
- /dashboard/optimizer/projects
- /dashboard/optimizer/projects/new
- /api/optimizer/projects

## Architecture decisions
1. Preserve the existing CMS and its Article model.
2. Keep optimizer data in dedicated models to avoid mixing publisher-authored public content with customer SaaS data.
3. Reuse existing Auth.js/NextAuth authentication and Prisma/PostgreSQL infrastructure.
4. Reuse existing AI usage infrastructure where appropriate later, while keeping product-level optimizer usage explicit.
5. Use server-side ownership filters on every optimizer query and API mutation.
6. Introduce paid APIs only after the mock/local workflow is functional.

## Deferred to later phases
- Article create/import UI and URL ingestion.
- Analysis engine and scoring implementation.
- AI provider abstraction for optimizer analysis.
- Evidence collection/research providers.
- Rewrite/optimization workflow.
- Billing, plans, credits, Stripe, and hard usage limits.
- Exports and reporting.
- Admin optimizer analytics.

## Next phase
Phase 2 should implement optimizer article ingestion and management: paste content, optional source URL, target query, article CRUD, project detail workspace, validation, ownership tests, and mock analysis entry points.
