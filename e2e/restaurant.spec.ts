import { test, expect } from '@playwright/test';

test.describe('Restaurant Management Flow', () => {
  let authEmail: string;
  let authPassword = 'password123';

  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    authEmail = `restaurant-${Date.now()}@example.com`;
    await page.goto('/auth/register');
    await page.fill('input[name="name"]', 'Restaurant Test User');
    await page.fill('input[name="email"]', authEmail);
    await page.fill('input[name="password"]', authPassword);
    await page.fill('input[name="confirmPassword"]', authPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*auth\/login/);
    await page.fill('input[name="email"]', authEmail);
    await page.fill('input[name="password"]', authPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should create a new restaurant', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=Create New Restaurant');

    // Fill restaurant form
    await page.fill('input[name="name"]', 'Test Restaurant');
    await page.fill('input[name="street"]', '123 Main Street');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="state"]', 'NY');
    await page.fill('input[name="zipCode"]', '10001');
    await page.selectOption('select[name="country"]', 'USA');
    await page.fill('input[name="phone"]', '123-456-7890');
    await page.fill('input[name="email"]', 'restaurant@example.com');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to restaurant detail page
    await expect(page).toHaveURL(/.*restaurants\/[a-f0-9]+/);
    await expect(page.locator('h1')).toContainText('Test Restaurant');
  });

  test('should display restaurants on dashboard', async ({ page }) => {
    // Create a restaurant first
    await page.goto('/restaurants/new');
    await page.fill('input[name="name"]', 'Dashboard Test Restaurant');
    await page.fill('input[name="street"]', '456 Oak Ave');
    await page.fill('input[name="city"]', 'Los Angeles');
    await page.selectOption('select[name="country"]', 'USA');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*restaurants\/[a-f0-9]+/);

    // Go to dashboard
    await page.goto('/dashboard');

    // Should see the restaurant
    await expect(page.locator('text=Dashboard Test Restaurant')).toBeVisible();
  });

  test('should edit restaurant', async ({ page }) => {
    // Create a restaurant first
    await page.goto('/restaurants/new');
    await page.fill('input[name="name"]', 'Edit Test Restaurant');
    await page.fill('input[name="street"]', '789 Pine St');
    await page.fill('input[name="city"]', 'Chicago');
    await page.selectOption('select[name="country"]', 'USA');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*restaurants\/[a-f0-9]+/);

    // Click edit
    await page.click('text=Edit');

    // Update restaurant name
    await page.fill('input[name="name"]', 'Updated Restaurant Name');
    await page.click('button[type="submit"]');

    // Should see updated name
    await expect(page.locator('h1')).toContainText('Updated Restaurant Name');
  });
});

