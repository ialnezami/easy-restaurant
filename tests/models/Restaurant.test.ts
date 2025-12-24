import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import Restaurant from '@/models/Restaurant';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

describe('Restaurant Model', () => {
  let testUser: any;

  beforeAll(async () => {
    await connectDB();
    // Create a test user
    testUser = await User.create({
      name: 'Test Owner',
      email: 'owner@example.com',
      password: 'password123',
    });
  });

  afterAll(async () => {
    // Cleanup
    if (testUser) {
      await Restaurant.deleteMany({ owner: testUser._id });
      await User.findByIdAndDelete(testUser._id);
    }
    await mongoose.connection.close();
  });

  describe('Restaurant Creation', () => {
    it('should create a restaurant with valid data', async () => {
      const restaurantData = {
        name: 'Test Restaurant',
        owner: testUser._id,
        addresses: [
          {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
        ],
        contactInfo: {
          phone: '123-456-7890',
          email: 'restaurant@example.com',
        },
      };

      const restaurant = await Restaurant.create(restaurantData);
      expect(restaurant).toBeDefined();
      expect(restaurant.name).toBe(restaurantData.name);
      expect(restaurant.addresses).toHaveLength(1);
      expect(restaurant.contactInfo.phone).toBe(restaurantData.contactInfo.phone);

      // Cleanup
      await Restaurant.findByIdAndDelete(restaurant._id);
    });

    it('should require name field', async () => {
      const restaurantData = {
        owner: testUser._id,
        addresses: [],
      };

      await expect(Restaurant.create(restaurantData)).rejects.toThrow();
    });

    it('should require owner field', async () => {
      const restaurantData = {
        name: 'Test Restaurant',
        addresses: [],
      };

      await expect(Restaurant.create(restaurantData)).rejects.toThrow();
    });

    it('should allow multiple addresses', async () => {
      const restaurantData = {
        name: 'Multi Location Restaurant',
        owner: testUser._id,
        addresses: [
          {
            street: '123 Main St',
            city: 'New York',
            country: 'USA',
          },
          {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            country: 'USA',
          },
        ],
      };

      const restaurant = await Restaurant.create(restaurantData);
      expect(restaurant.addresses).toHaveLength(2);

      // Cleanup
      await Restaurant.findByIdAndDelete(restaurant._id);
    });
  });
});

