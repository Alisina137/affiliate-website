import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Sign In/);
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
  });

  test("should show register page", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveTitle(/Create Account/);
    await expect(page.getByRole("heading", { name: /Create your account/i })).toBeVisible();
  });

  test("should show validation errors on register", async ({ page }) => {
    await page.goto("/register");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/Email is required/i)).toBeVisible();
  });

  test("should show validation errors on login", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
  });
});
