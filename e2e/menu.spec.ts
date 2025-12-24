import { test, expect } from '@playwright/test';

test.describe('Menu Management Flow', () => {
  let authEmail: string;
  let authPassword = 'password123';
  let restaurantId: string;

  test.beforeEach(async ({ page }) => {
    // Register, login, and create a restaurant
    authEmail = `menu-${Date.now()}@example.com`;
    await page.goto('/auth/register');
    await page.fill('input[name="name"]', 'Menu Test User');
    await page.fill('input[name="email"]', authEmail);
    await page.fill('input[name="password"]', authPassword);
    await page.fill('input[name="confirmPassword"]', authPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*auth\/login/);
    await page.fill('input[name="email"]', authEmail);
    await page.fill('input[name="password"]', authPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);

    // Create restaurant
    await page.goto('/restaurants/new');
    await page.fill('input[name="name"]', 'Menu Test Restaurant');
    await page.fill('input[name="street"]', '123 Test St');
    await page.fill('input[name="city"]', 'Test City');
    await page.selectOption('select[name="country"]', 'USA');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*restaurants\/([a-f0-9]+)/);
    const url = page.url();
    restaurantId = url.split('/restaurants/')[1];
  });

  test('should create a new menu', async ({ page }) => {
    await page.goto(`/restaurants/${restaurantId}`);
    await page.click('text=Create New Menu');

    // Fill menu form
    await page.fill('input[name="name"]', 'Lunch Menu');
    await page.fill('input[name="slug"]', `lunch-menu-${Date.now()}`);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to menu management page
    await expect(page).toHaveURL(/.*menus\/[a-f0-9]+/);
  });

  test('should add menu item', async ({ page }) => {
    // Create menu first
    await page.goto(`/restaurants/${restaurantId}/menus/new`);
    const slug = `test-menu-${Date.now()}`;
    await page.fill('input[name="name"]', 'Test Menu');
    await page.fill('input[name="slug"]', slug);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*menus\/[a-f0-9]+/);

    // Add menu item
    await page.click('text=Add Item');
    await page.fill('input[name="name"]', 'Burger');
    await page.fill('textarea[name="description"]', 'Delicious burger');
    await page.fill('input[name="price"]', '12.99');
    await page.fill('input[name="category"]', 'Main Course');
    await page.click('button[type="submit"]');

    // Should see the menu item
    await expect(page.locator('text=Burger')).toBeVisible();
    await expect(page.locator('text=$12.99')).toBeVisible();
  });

  test('should view public menu', async ({ page }) => {
    // Create menu and item
    await page.goto(`/restaurants/${restaurantId}/menus/new`);
    const slug = `public-menu-${Date.now()}`;
    await page.fill('input[name="name"]', 'Public Menu');
    await page.fill('input[name="slug"]', slug);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*menus\/[a-f0-9]+/);
    await page.click('text=Add Item');
    await page.fill('input[name="name"]', 'Pizza');
    await page.fill('input[name="price"]', '15.99');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*menus\/[a-f0-9]+/);

    // View public menu (logout first to test public access)
    await page.click('text=Sign Out');
    await page.goto(`/menu/${slug}`);

    // Should see restaurant and menu items
    await expect(page.locator('text=Menu Test Restaurant')).toBeVisible();
    await expect(page.locator('text=Pizza')).toBeVisible();
  });
});

