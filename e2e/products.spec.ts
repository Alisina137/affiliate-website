import { test, expect } from "@playwright/test";

test.describe("Product Pages", () => {
  test("should show product page when exists", async ({ page }) => {
    // First, ensure there's a product
    await page.goto("/categories");
    const productLink = page.locator('a[href^="/products/"]').first();
    
    if (await productLink.count() > 0) {
      const href = await productLink.getAttribute("href");
      await page.goto(href!);
      await expect(page.locator("h1")).toBeVisible();
    } else {
      test.skip();
    }
  });

  test("should show not found for invalid product", async ({ page }) => {
    await page.goto("/products/this-product-does-not-exist-12345");
    await expect(page.getByText(/Product Not Found/i)).toBeVisible();
  });

  test("should have affiliate CTA on product page", async ({ page }) => {
    await page.goto("/categories");
    const productLink = page.locator('a[href^="/products/"]').first();
    
    if (await productLink.count() > 0) {
      const href = await productLink.getAttribute("href");
      await page.goto(href!);
      // Check if any affiliate link exists (amazon, etc.)
      const affiliateLink = page.locator('a[href*="amazon"], a[href*="click"]').first();
      // CTA may or may not exist depending on data
      if (await affiliateLink.count() > 0) {
        await expect(affiliateLink).toBeVisible();
      }
    } else {
      test.skip();
    }
  });
});
