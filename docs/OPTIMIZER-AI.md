# Affiliate Optimizer — AI Provider Setup

The Optimizer keeps its deterministic provider by default. Production remote AI is opt-in.

## Local/default mode

No credentials are required:

```
OPTIMIZER_AI_PROVIDER=local
```

This uses the deterministic development provider and makes no paid remote AI calls.

## OpenAI mode

Configure server-side environment variables:

```
OPTIMIZER_AI_PROVIDER=openai
OPENAI_API_KEY=
OPTIMIZER_OPENAI_MODEL=gpt-5-mini
```

`OPTIMIZER_OPENAI_MODEL` is optional. Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_*` variable.

## Runtime behavior

- The existing deterministic six-category analysis engine remains unchanged.
- Only the explicit optimization workflow uses the remote provider.
- Article text is treated as untrusted data and delimited separately from instructions.
- Remote output must satisfy the Optimizer structured schema before it can be stored.
- Suggestions remain SUGGESTED until the user explicitly accepts or rejects them.
- Provider/model and available input/output token counts are stored as optimization/usage metadata.
- Provider timeout is 45 seconds.
- Missing configuration and provider failures return controlled errors; they do not silently fall back to a paid/alternate provider.
- The provider is instructed not to fabricate prices, ratings, reviews, specifications, SEO metrics, revenue, conversion claims, testing experience, scarcity, or guarantees.
