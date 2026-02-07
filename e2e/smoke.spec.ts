import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/PwmngerTS/i);
});

test('login link works', async ({ page }) => {
  await page.goto('/');

  // Look for a link with name "Login" or similar
  const loginLink = page.getByRole('link', { name: /login/i });
  if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login.*/);
  }
});
