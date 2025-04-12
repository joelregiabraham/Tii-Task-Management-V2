import { test, expect } from '@playwright/test';

test('Login page renders and allows login', async ({ page }) => {
  await page.goto('http://localhost:64191/login');

    await page.fill('input[name="username"]', 'Tester1');
    await page.fill('input[name="password"]', 'Tester1@123');
  await page.click('button:has-text("Sign In")');

  await expect(page).toHaveURL(/dashboard/i);
});
