import { afterEach, describe, expect, it } from "vitest"
import { createHmac } from "node:crypto"
import { planFromStripePrice, verifyStripeSignature } from "./stripe"

const original = { ...process.env }
afterEach(() => { process.env = { ...original } })

describe("optimizer Stripe billing", () => {
  it("maps only configured paid price IDs", () => {
    process.env.STRIPE_OPTIMIZER_STARTER_PRICE_ID = "price_starter"
    process.env.STRIPE_OPTIMIZER_PRO_PRICE_ID = "price_pro"
    expect(planFromStripePrice("price_starter")).toBe("STARTER")
    expect(planFromStripePrice("price_pro")).toBe("PRO")
    expect(planFromStripePrice("price_unknown")).toBeNull()
  })

  it("accepts a valid recent webhook signature and rejects tampering", () => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test"
    const payload = '{"type":"customer.subscription.updated"}'
    const now = 1_800_000_000_000
    const timestamp = String(now / 1000)
    const signature = createHmac("sha256", "whsec_test").update(`${timestamp}.${payload}`).digest("hex")
    expect(verifyStripeSignature(payload, `t=${timestamp},v1=${signature}`, now)).toBe(true)
    expect(verifyStripeSignature(payload + "x", `t=${timestamp},v1=${signature}`, now)).toBe(false)
  })
})
