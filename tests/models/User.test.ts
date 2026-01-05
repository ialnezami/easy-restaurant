import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

describe('User Model', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed

      // Cleanup
      await User.findByIdAndDelete(user._id);
    });

    it('should require name field', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require email field', async () => {
      const userData = {
        name: 'Test User',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require password field', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      const userData = {
        name: 'Test User',
        email: 'unique@example.com',
        password: 'password123',
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow();

      // Cleanup
      await User.findOneAndDelete({ email: userData.email });
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const userData = {
        name: 'Test User',
        email: 'hash@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(20); // bcrypt hash length

      // Cleanup
      await User.findByIdAndDelete(user._id);
    });
  });

  describe('Password Comparison', () => {
    it('should compare password correctly', async () => {
      const userData = {
        name: 'Test User',
        email: 'compare@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      const isValid = await user.comparePassword('password123');
      expect(isValid).toBe(true);

      const isInvalid = await user.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);

      // Cleanup
      await User.findByIdAndDelete(user._id);
    });
  });
});


