import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateToken, verifyToken } from '@/lib/utils/auth';
import jwt from 'jsonwebtoken';

// Mock environment variable
vi.stubEnv('JWT_SECRET', 'test-secret-key');

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = {
        _id: '123456789',
        email: 'test@example.com',
      };

      const token = generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include user id and email in token payload', () => {
      const user = {
        _id: '123456789',
        email: 'test@example.com',
      };

      const token = generateToken(user);
      
      // Token should be a non-empty string
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      
      // Use verifyToken function instead of jwt.verify directly
      const decoded = verifyToken(token);
      expect(decoded).toBeTruthy();
      expect(decoded.id).toBe(user._id);
      expect(decoded.email).toBe(user.email);
    });

    it('should set token expiration to 7 days', () => {
      const user = {
        _id: '123456789',
        email: 'test@example.com',
      };

      const token = generateToken(user);
      
      // Use verifyToken function instead of jwt.verify directly
      const decoded = verifyToken(token);
      expect(decoded).toBeTruthy();

      // Check expiration is set (should be ~7 days from now)
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      
      const expirationTime = decoded.exp - decoded.iat;
      const sevenDaysInSeconds = 7 * 24 * 60 * 60;
      expect(expirationTime).toBe(sevenDaysInSeconds);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const user = {
        _id: '123456789',
        email: 'test@example.com',
      };

      const token = generateToken(user);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(user._id);
      expect(decoded.email).toBe(user.email);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const result = verifyToken(invalidToken);

      expect(result).toBeNull();
    });

    it('should return null for expired token', () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { id: '123', email: 'test@example.com' },
        'test-secret-key',
        { expiresIn: '-1s' } // Already expired
      );

      const result = verifyToken(expiredToken);

      expect(result).toBeNull();
    });

    it('should return null for token with wrong signature', () => {
      const token = jwt.sign(
        { id: '123', email: 'test@example.com' },
        'wrong-secret',
        { expiresIn: '7d' }
      );

      const result = verifyToken(token);

      expect(result).toBeNull();
    });
  });
});
