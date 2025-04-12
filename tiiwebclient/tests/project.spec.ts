import { test, expect } from '@playwright/test';

test('User can create a project ', async ({ page }) => {
    // Step 1: Login
    await page.goto('http://localhost:64191/login');

    await page.fill('input[name="username"]', 'Tester1');
    await page.fill('input[name="password"]', 'Tester1@123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/i);

    // Step 2: Create Project
    await page.goto('http://localhost:64191/projects/create');

    const projectName = `Project ${Date.now()}`;
    await page.fill('input[name="name"]', projectName);
    await page.fill('textarea[name="description"]', 'E2E created project');
    await page.click('button:has-text("Create Project")');

    await expect(page).toHaveURL(/\/projects$/);
    await expect(
        page.locator('.project-card .project-title', { hasText: projectName })
    ).toBeVisible({ timeout: 5000 });

    
});
