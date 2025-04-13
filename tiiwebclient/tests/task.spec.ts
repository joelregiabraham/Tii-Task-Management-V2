// tests/task.spec.ts
import { test, expect } from '@playwright/test';

test('User can create a task inside a project', async ({ page }) => {
    // Step 1: Login
    await page.goto('http://localhost:64191/login');
    await page.fill('input[name="username"]', 'Tester1');
    await page.fill('input[name="password"]', 'Tester1@123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/i);

    // Step 2: Navigate to the first project (assumes at least one exists)
    const firstProjectCard = page.locator('a:has(h6)').first();
    await expect(firstProjectCard).toBeVisible();
    await firstProjectCard.click();

    // Step 3: Go to the "Add Task" page
    await expect(page).toHaveURL(/projects\/\d+$/);
    await page.click('text=Add Task');

    // Step 4: Fill in the task creation form
    const taskTitle = `Task ${Date.now()}`;
    await page.fill('input[name="title"]', taskTitle);
    await page.fill('textarea[name="description"]', 'Automated test task description');

    // Click the "To Do" status box
    await page.locator('.status-option-box.todo').click();

    // Fill in the due date (+5 days from now)
    const dueDate = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    await page.fill('input[name="dueDate"]', dueDate);

    // Step 5: Submit the form
    await page.click('button:has-text("Create Task")');

    // Step 6: Expect redirection to project page
    await expect(page).toHaveURL(/projects\/\d+$/);

    // Step 7: Click on the "Tasks" tab to view task list
    await page.click('text=Tasks');

    // Step 8: Verify the new task appears in the list
    await expect(
        page.getByRole('link', { name: taskTitle })
    ).toBeVisible({ timeout: 5000 });
});
