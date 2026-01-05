import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import Menu, { MenuItem } from '@/models/Menu';
import Restaurant from '@/models/Restaurant';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

describe('Menu Model', () => {
  let testUser: any;
  let testRestaurant: any;

  beforeAll(async () => {
    await connectDB();
    testUser = await User.create({
      name: 'Test Owner',
      email: 'menuowner@example.com',
      password: 'password123',
    });
    testRestaurant = await Restaurant.create({
      name: 'Test Restaurant',
      owner: testUser._id,
      addresses: [
        {
          street: '123 Main St',
          city: 'New York',
          country: 'USA',
        },
      ],
    });
  });

  afterAll(async () => {
    if (testRestaurant) {
      await Menu.deleteMany({ restaurant: testRestaurant._id });
      await Restaurant.findByIdAndDelete(testRestaurant._id);
    }
    if (testUser) {
      await User.findByIdAndDelete(testUser._id);
    }
    await mongoose.connection.close();
  });

  describe('Menu Creation', () => {
    it('should create a menu with valid data', async () => {
      const menuData = {
        restaurant: testRestaurant._id,
        name: 'Lunch Menu',
        slug: 'lunch-menu-test',
        items: [],
      };

      const menu = await Menu.create(menuData);
      expect(menu).toBeDefined();
      expect(menu.name).toBe(menuData.name);
      expect(menu.slug).toBe(menuData.slug);

      // Cleanup
      await Menu.findByIdAndDelete(menu._id);
    });

    it('should require restaurant field', async () => {
      const menuData = {
        name: 'Test Menu',
        slug: 'test-menu',
        items: [],
      };

      await expect(Menu.create(menuData)).rejects.toThrow();
    });

    it('should require slug field', async () => {
      const menuData = {
        restaurant: testRestaurant._id,
        name: 'Test Menu',
        items: [],
      };

      await expect(Menu.create(menuData)).rejects.toThrow();
    });

    it('should enforce unique slug', async () => {
      const menuData = {
        restaurant: testRestaurant._id,
        name: 'Test Menu',
        slug: 'unique-slug-test',
        items: [],
      };

      await Menu.create(menuData);
      await expect(Menu.create(menuData)).rejects.toThrow();

      // Cleanup
      await Menu.findOneAndDelete({ slug: menuData.slug });
    });
  });

  describe('MenuItem Creation', () => {
    it('should create a menu item with valid data', async () => {
      const itemData = {
        name: 'Burger',
        description: 'Delicious burger',
        price: 12.99,
        category: 'Main Course',
      };

      const item = await MenuItem.create(itemData);
      expect(item).toBeDefined();
      expect(item.name).toBe(itemData.name);
      expect(item.price).toBe(itemData.price);

      // Cleanup
      await MenuItem.findByIdAndDelete(item._id);
    });

    it('should require name field', async () => {
      const itemData = {
        price: 12.99,
      };

      await expect(MenuItem.create(itemData)).rejects.toThrow();
    });

    it('should require price field', async () => {
      const itemData = {
        name: 'Burger',
      };

      await expect(MenuItem.create(itemData)).rejects.toThrow();
    });

    it('should not allow negative prices', async () => {
      const itemData = {
        name: 'Burger',
        price: -10,
      };

      await expect(MenuItem.create(itemData)).rejects.toThrow();
    });
  });
});


