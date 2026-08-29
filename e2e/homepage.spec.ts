import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Affiliate Platform/);
  });

  test("should have hero section", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("should have search input", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(/Search for products/i);
    await expect(searchInput).toBeVisible();
  });

  test("should navigate to categories", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/categories"]');
    await expect(page).toHaveURL(/.*categories/);
  });
});
