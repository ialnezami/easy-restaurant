import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testName = 'Test User';

  test('should register a new user', async ({ page }) => {
    await page.goto('/auth/register');

    // Fill registration form
    await page.fill('input[name="name"]', testName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to login page
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('should login with valid credentials', async ({ page }) => {
    // First register a user
    await page.goto('/auth/register');
    const email = `login-${Date.now()}@example.com`;
    await page.fill('input[name="name"]', 'Login Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*auth\/login/);

    // Now login
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth/register');
    const email = `logout-${Date.now()}@example.com`;
    await page.fill('input[name="name"]', 'Logout Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*auth\/login/);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);

    // Click logout
    await page.click('text=Sign Out');

    // Should redirect to home or login
    await expect(page).toHaveURL(/.*\/$|.*auth\/login/);
  });
});


