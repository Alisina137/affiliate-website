# Affiliate Optimizer — Stripe Billing Setup

Phase 7 uses Stripe Checkout for new paid subscriptions, Stripe Customer Portal for self-service billing, and signed webhooks as the only authority that grants or changes paid Optimizer entitlements.

## Required server environment variables

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_OPTIMIZER_STARTER_PRICE_ID=
STRIPE_OPTIMIZER_PRO_PRICE_ID=
STRIPE_OPTIMIZER_AGENCY_PRICE_ID=
```

The existing `NEXT_PUBLIC_SITE_URL` or `NEXTAUTH_URL` is used for Checkout and Portal return URLs.

Never expose the secret key or webhook secret through `NEXT_PUBLIC_*` variables.

## Stripe products/prices

Create three recurring monthly Stripe Prices matching the approved Optimizer catalog:
- Starter — $19/month
- Pro — $49/month
- Agency — $99/month

Put each Stripe Price ID in the matching environment variable above. The Free plan never goes through Stripe.

## Webhook endpoint

Configure Stripe to send these events to:

`/api/optimizer/billing/webhook`

Required events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Use the endpoint signing secret as `STRIPE_WEBHOOK_SECRET`.

## Security model

- Checkout requires an authenticated Affiliate user.
- The client sends only a requested plan name; the server chooses the configured Stripe Price ID.
- Checkout success does not grant a paid plan.
- Paid entitlement changes only after a webhook passes Stripe signature verification.
- Webhook subscription state is re-fetched from Stripe before persistence to reduce out-of-order delivery risk.
- Only configured Optimizer Price IDs map to paid plans.
- Subscription metadata binds the Stripe subscription to the authenticated Affiliate user and the OPTIMIZER module.
- Existing paid customers are directed to the Stripe Customer Portal instead of creating parallel subscriptions.
- If Stripe is not fully configured, paid checkout remains disabled and Free continues to work.
