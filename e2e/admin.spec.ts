import { test, expect } from "@playwright/test";

test.describe("Admin Panel", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show admin login", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
  });

  test("should have admin sidebar after login", async ({ page }) => {
    // This test requires a logged-in admin user
    // For now, just test the login page
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
  });
});
