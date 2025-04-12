// register.spec.ts
import { test, expect } from '@playwright/test';

test('Register page should render and allow new user registration', async ({ page }) => {
    await page.goto('http://localhost:64191/register');

    // Validate title or header
    await expect(page.locator('h1')).toHaveText(/Tii Task Manager/i);

    // Fill out registration form
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="username"]', 'testuser' + Date.now()); // make username unique
    await page.fill('input[name="email"]', `test${Date.now()}@mail.com`);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard or success confirmation
    await expect(page).toHaveURL(/dashboard/i);
});
