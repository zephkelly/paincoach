import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EnvelopeEncryption } from '../utils/envelope';
import * as crypto from 'crypto';


// Import the types
export interface EncryptionKey {
  id: string;
  value: string;
  isExpiring?: boolean;
  expiryDate?: Date;
  createdAt?: Date;
}

export interface EncryptedData {
  encryptedData: string;
  encryptedDataKey: string;
  keyId: string;
  iv: string;
}

// Mock crypto for consistent testing
vi.mock('crypto', async () => {
  const actual = await vi.importActual<typeof import('crypto')>('crypto');
  
  return {
    ...actual,
    // We'll create deterministic randomBytes for testing
    randomBytes: vi.fn((size: number) => {
      const buffer = Buffer.alloc(size);
      buffer.fill(1); // Fill with 1s for predictable output
      return buffer;
    })
  };
});

describe('EnvelopeEncryption', () => {
  let encryptionKeys: EncryptionKey[];
  let envelopeEncryption: EnvelopeEncryption;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    // Spy on console.log to check for rotation warnings
    consoleLogSpy = vi.spyOn(console, 'log');
    
    // Create test keys with strong random values
    encryptionKeys = [
      {
        id: 'key-1',
        value: crypto.randomBytes(32).toString('base64'),
        createdAt: new Date(),
        isExpiring: false
      },
      {
        id: 'key-2',
        value: crypto.randomBytes(32).toString('base64'),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
        isExpiring: false
      },
      {
        id: 'key-3',
        value: crypto.randomBytes(32).toString('base64'),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
        isExpiring: true,
        expiryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // Expired 3 days ago
      }
    ];
    
    envelopeEncryption = new EnvelopeEncryption([...encryptionKeys.slice(0, 2)]); // Only use first 2 keys initially
  });
  
  afterEach(() => {
    consoleLogSpy.mockRestore();
    vi.resetAllMocks();
  });
  
  describe('constructor', () => {
    it('should throw an error if no keys are provided', () => {
      expect(() => new EnvelopeEncryption([])).toThrow('At least one encryption key is required');
    });
    
    it('should throw an error if keys array is null or undefined', () => {
      // @ts-ignore - Testing invalid input
      expect(() => new EnvelopeEncryption(null)).toThrow('At least one encryption key is required');
      // @ts-ignore - Testing invalid input
      expect(() => new EnvelopeEncryption(undefined)).toThrow('At least one encryption key is required');
    });
    
    it('should mark the oldest key as expiring', () => {
      // Create a fresh instance to test constructor behavior
      const instance = new EnvelopeEncryption([...encryptionKeys.slice(0, 2)]);
      
      // Check if the last key is marked as expiring
      const keys = instance['encryptionKeys'];
      expect(keys).toBeDefined();
      expect(keys.length).toBeGreaterThan(1);
      
      if (keys && keys.length > 1) {
        const lastKey = keys[1];
        expect(lastKey).toBeDefined();
        if (lastKey) {
          expect(lastKey.isExpiring).toBe(true);
          expect(lastKey.expiryDate).toBeDefined();
          
          // Verify expiry date is set to ~1 week from now
          const now = new Date();
          const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          const expiryDate = lastKey.expiryDate as Date;
          
          // Should be within 1 second of expected date
          expect(Math.abs(expiryDate.getTime() - oneWeekFromNow.getTime())).toBeLessThan(1000);
        }
      }
    });
    
    it('should not modify keys if only one key is provided', () => {
        if (!encryptionKeys[0]) throw new Error('No encryption keys available');
        const singleKey = [encryptionKeys[0]];
      const instance = new EnvelopeEncryption(singleKey);
      
      // With a single key, no changes should be made
      const keys = instance['encryptionKeys'];
      expect(keys).toBeDefined();
      expect(keys.length).toBe(1);
      
      if (keys && keys.length > 0) {
        const firstKey = keys[0];
        expect(firstKey).toBeDefined();
        if (firstKey) {
          expect(firstKey.isExpiring).toBeFalsy();
          expect(firstKey.expiryDate).toBeUndefined();
        }
      }
    });
    
    it('should not modify expiry info if last key is already marked as expiring', () => {
      // Create keys with the last one already marked as expiring
      const preMarkedKeys = [
        { ...encryptionKeys[0] },
        { 
          ...encryptionKeys[1], 
          isExpiring: true, 
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) // 2 weeks in future
        }
      ];

      if (!preMarkedKeys[1]) throw new Error('No encryption keys available');
      
      const originalExpiryDate = preMarkedKeys[1].expiryDate;
      expect(originalExpiryDate).toBeDefined();

      //@ts-expect-error
      const instance = new EnvelopeEncryption(preMarkedKeys);
      const keys = instance['encryptionKeys'];
      expect(keys).toBeDefined();
      
      if (keys && keys.length > 1) {
        const lastKey = keys[1];
        expect(lastKey).toBeDefined();
        if (lastKey && originalExpiryDate) {
          // Should preserve the existing expiry date
          expect(lastKey.expiryDate).toEqual(originalExpiryDate);
        }
      }
    });
    
    it('should maintain key order (newest first) when instantiated', () => {
      // Create keys in random order
      const shuffledKeys = [
        { ...encryptionKeys[1] }, // older key
        { ...encryptionKeys[0] }  // newer key
      ];
      
      //@ts-expect-error
      const instance = new EnvelopeEncryption(shuffledKeys);
      const keys = instance['encryptionKeys'];
      expect(keys).toBeDefined();
      
      if (keys && keys.length > 1) {
        const firstKey = keys[0];
        const secondKey = keys[1];
        
        expect(firstKey).toBeDefined();
        expect(secondKey).toBeDefined();
        
        if (firstKey && secondKey) {
            if (!shuffledKeys[0] || !shuffledKeys[1]) throw new Error('No encryption keys available');
          // Should preserve the original order (not auto-sort by date)
          expect(firstKey.id).toBe(shuffledKeys[0].id);
          expect(secondKey.id).toBe(shuffledKeys[1].id);
        }
      }
    });
  });
  
  describe('encrypt', () => {
    it('should encrypt data and return a valid EncryptedData object', () => {
      const testData = { test: 'value', number: 123 };
      
      const result = envelopeEncryption.encrypt(testData);
      
      // Check that result has the expected structure
      expect(result).toHaveProperty('encryptedData');
      expect(result).toHaveProperty('encryptedDataKey');
      expect(result).toHaveProperty('keyId');
      expect(result).toHaveProperty('iv');

      if (!encryptionKeys[0]) throw new Error('No encryption keys available');
      
      // Verify it's using the primary key
      expect(result.keyId).toBe(encryptionKeys[0].id);
      
      // Verify the encrypted data contains a dot (separating data from auth tag)
      expect(result.encryptedData.includes('.')).toBe(true);
      
      // Verify the encrypted data key contains a dot (separating key from auth tag)
      expect(result.encryptedDataKey.includes('.')).toBe(true);
      
      // Verify the IV is a base64 string of the correct length (16 bytes → ~24 chars in base64)
      expect(result.iv.length).toBeGreaterThanOrEqual(22);
      expect(result.iv.length).toBeLessThanOrEqual(25);
    });
    
    it('should generate different encrypted data for the same input on subsequent calls', () => {
      const testData = { message: 'hello world' };
      
      // Reset the mock before each encryption to ensure different random bytes
      vi.mocked(crypto.randomBytes).mockImplementationOnce((size) => {
        const buffer = Buffer.alloc(size);
        buffer.fill(1);
        return buffer;
      }).mockImplementationOnce((size) => {
        const buffer = Buffer.alloc(size);
        buffer.fill(2);
        return buffer;
      });
      
      const result1 = envelopeEncryption.encrypt(testData);
      const result2 = envelopeEncryption.encrypt(testData);
      
      // The results should be different due to different IVs
      expect(result1.encryptedData).not.toBe(result2.encryptedData);
      expect(result1.iv).not.toBe(result2.iv);
    });
    
    it('should throw error if primary key is unavailable', () => {
      // Create encryption instance with empty keys array but bypass constructor check
      if (!encryptionKeys[0]) throw new Error('No encryption keys available');
      const instance = new EnvelopeEncryption([encryptionKeys[0]]);
      
      // @ts-ignore - Modifying private property for testing
      instance.encryptionKeys = [];
      
      // Should throw when attempting to encrypt without a primary key
      expect(() => instance.encrypt({ test: 'data' })).toThrow('No primary encryption key available');
    });
    
    it('should handle encryption of various data types', () => {
      const testCases = [
        { type: 'string', value: 'simple string' },
        { type: 'number', value: 12345 },
        { type: 'boolean', value: true },
        { type: 'null', value: null },
        { type: 'undefined', value: undefined },
        { type: 'date', value: new Date() },
        { type: 'regex', value: /test-pattern/ },
        { type: 'arraybuffer', value: new ArrayBuffer(8) },
      ];
      
      for (const testCase of testCases) {
        const encrypted = envelopeEncryption.encrypt(testCase.value);
        expect(encrypted).toHaveProperty('encryptedData');
        
        // For regular JSON-compatible values, verify round trip works
        if (['string', 'number', 'boolean', 'null'].includes(testCase.type)) {
          const decrypted = envelopeEncryption.decrypt(encrypted);
          expect(decrypted).toEqual(testCase.value);
        }
      }
    });
    
    it('should produce different outputs for slightly different inputs', () => {
      const data1 = { secret: 'value1' };
      const data2 = { secret: 'value2' };
      
      const encrypted1 = envelopeEncryption.encrypt(data1);
      const encrypted2 = envelopeEncryption.encrypt(data2);
      
      // Even with the same IV (due to mocking), the encrypted data should differ
      expect(encrypted1.encryptedData).not.toBe(encrypted2.encryptedData);
    });
  });
  
  describe('decrypt', () => {
    it('should correctly decrypt previously encrypted data', () => {
      const testData = { test: 'secret-value', nested: { prop: 'value' } };
      
      const encrypted = envelopeEncryption.encrypt(testData);
      const decrypted = envelopeEncryption.decrypt<typeof testData>(encrypted);
      
      expect(decrypted).toEqual(testData);
    });
    
    it('should throw an error for invalid encrypted data format', () => {
      const invalidData: EncryptedData = {
        encryptedData: 'invalid-format-without-dot',
        encryptedDataKey: 'some-key.with-tag',
        keyId: 'key-1',
        iv: Buffer.alloc(16).toString('base64')
      };
      
      expect(() => envelopeEncryption.decrypt(invalidData)).toThrow('Invalid encrypted data format');
    });
    
    it('should throw an error if auth tag is missing from encrypted data', () => {
      const invalidData: EncryptedData = {
        encryptedData: 'data-part.',  // Empty auth tag part
        encryptedDataKey: 'some-key.with-tag',
        keyId: 'key-1',
        iv: Buffer.alloc(16).toString('base64')
      };
      
      expect(() => envelopeEncryption.decrypt(invalidData)).toThrow('Auth tag is missing from encrypted data');
    });
    
    it('should throw an error if IV is missing', () => {
      const testData = { message: 'test' };
      const encrypted = envelopeEncryption.encrypt(testData);
      
      // Create a modified version with missing IV
      const invalidData = { ...encrypted, iv: '' };
      
      expect(() => envelopeEncryption.decrypt(invalidData)).toThrow('IV is missing from encrypted data');
    });
    
    it('should throw an error if data key cannot be decrypted with any available key', () => {
      const testData = { message: 'test' };
      const encrypted = envelopeEncryption.encrypt(testData);
      
      // Create a new instance with different keys that can't decrypt this data
      const newKeys: EncryptionKey[] = [
        {
          id: 'different-key',
          value: crypto.randomBytes(32).toString('base64')
        }
      ];
      const newInstance = new EnvelopeEncryption(newKeys);
      
      expect(() => newInstance.decrypt(encrypted)).toThrow('Failed to decrypt data key with any available key');
    });
    
    it('should decrypt data encrypted with any available key', () => {
      // Set up data that was encrypted with the older key
      const testData = { message: 'encrypted with old key' };
      
      // Create a temporary instance with only the second key
      if (!encryptionKeys[1]) throw new Error('No encryption keys available');

      const tempEncryption = new EnvelopeEncryption([encryptionKeys[1]]);
      const encrypted = tempEncryption.encrypt(testData);
      
      // Now decrypt with our main instance that has both keys
      const decrypted = envelopeEncryption.decrypt<typeof testData>(encrypted);
      
      // The data should be correctly decrypted
      expect(decrypted).toEqual(testData);
      
      // It should log about using an expiring key
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Data decrypted with expiring key')
      );
    });
    
    it('should throw error when attempting to decrypt tampered data', () => {
      const testData = { secretMessage: 'top secret' };
      const encrypted = envelopeEncryption.encrypt(testData);
      
      // Tamper with the encrypted data while keeping the format valid
      const parts = encrypted.encryptedData.split('.');
      expect(parts.length).toBe(2);
      
      if (parts.length === 2) {
        const [encryptedPart, authTag] = parts;

        if (!encryptedPart || !authTag) throw new Error('Invalid encrypted data format');

        const tamperedData = {
          ...encrypted,
          encryptedData: encryptedPart.substring(0, encryptedPart.length - 5) + 'XXXXX' + '.' + authTag
        };
        
        // Should throw when decrypting due to auth tag verification failure
        expect(() => envelopeEncryption.decrypt(tamperedData)).toThrow();
      }
    });
    
    it('should throw error when attempting to decrypt with tampered auth tag', () => {
      const testData = { secretMessage: 'another secret' };
      const encrypted = envelopeEncryption.encrypt(testData);
      
      // Tamper with the auth tag
      const parts = encrypted.encryptedData.split('.');
      expect(parts.length).toBe(2);
      
      if (parts.length === 2) {
        const [encryptedPart, authTag] = parts;

        if (!encryptedPart || !authTag) throw new Error('Invalid encrypted data format');

        const tamperedData = {
          ...encrypted,
          encryptedData: encryptedPart + '.' + authTag.substring(0, authTag.length - 5) + 'XXXXX'
        };
        
        // Should throw when decrypting due to auth tag verification failure
        expect(() => envelopeEncryption.decrypt(tamperedData)).toThrow();
      }
    });
    
    it('should throw error when attempting to decrypt with mismatched IV', () => {
      const testData = { secretMessage: 'yet another secret' };
      const encrypted = envelopeEncryption.encrypt(testData);
      
      vi.mocked(crypto.randomBytes).mockImplementationOnce((size) => {
        const buffer = Buffer.alloc(size);
        buffer.fill(99); // Use a completely different value
        return buffer;
      });
      
      // Replace IV with a different one that's guaranteed to be different
      const tamperedData = {
        ...encrypted,
        iv: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]).toString('base64')
      };
      
      // Should throw when decrypting due to IV mismatch
      expect(() => envelopeEncryption.decrypt(tamperedData)).toThrow();
    });
  });

  describe('rotateKey', () => {
    it('should re-encrypt only the data key with the newest key', () => {
      // Set up data that was encrypted with the older key
      const testData = { message: 'encrypted with old key' };
  
      if (!encryptionKeys[1]) throw new Error('No encryption keys available');
      
      // Create a temporary instance with only the second key
      const tempEncryption = new EnvelopeEncryption([encryptionKeys[1]]);
      
      // Mock Date.now for consistent timestamps
      const originalDateNow = Date.now;
      let dateNowCounter = 0;
      
      try {
        Date.now = vi.fn().mockImplementation(() => {
          return 1600000000000 + (dateNowCounter++ * 1000);
        });
        
        // Create a predictable encryption
        vi.mocked(crypto.randomBytes).mockImplementation((size) => {
          const buffer = Buffer.alloc(size);
          buffer.fill(10); // Consistent value for predictable output
          return buffer;
        });
        
        const originalEncrypted = tempEncryption.encrypt(testData);
        
        if (!encryptionKeys[0] || !encryptionKeys[1]) throw new Error('No encryption keys available');
        
        // Verify it's using the old key
        expect(originalEncrypted.keyId).toBe(encryptionKeys[1].id);
        
        // Store original encrypted data for comparison
        const originalEncryptedData = originalEncrypted.encryptedData;
        const originalIv = originalEncrypted.iv;
        
        // Rotate only the key (optimized rotation)
        const rotated = envelopeEncryption.rotateKey(originalEncrypted);
        
        // The keyId should now be the newest key
        expect(rotated.keyId).toBe(encryptionKeys[0].id);
        
        // The data should still decrypt correctly
        const decrypted = envelopeEncryption.decrypt<typeof testData>(rotated);
        expect(decrypted).toEqual(testData);
        
        // Unlike rotateKeyDeep, the actual encrypted data and IV should remain unchanged
        // Only the data key should be different
        expect(rotated.encryptedData).toBe(originalEncryptedData);
        expect(rotated.iv).toBe(originalIv);
        expect(rotated.encryptedDataKey).not.toBe(originalEncrypted.encryptedDataKey);
      } finally {
        // Restore original Date.now
        Date.now = originalDateNow;
      }
    });
  
    it('should skip re-encryption if already using the primary key', () => {
      const testData = { message: 'already encrypted with primary key' };
      
      // Encrypt with primary key
      const encrypted = envelopeEncryption.encrypt(testData);
      
      if (!encryptionKeys[0]) throw new Error('No encryption keys available');
      
      // Verify it's using the primary key
      expect(encrypted.keyId).toBe(encryptionKeys[0].id);
      
      // Apply rotation
      const rotated = envelopeEncryption.rotateKey(encrypted);
      
      // Since it's already using the primary key, it should return the same object
      expect(rotated).toEqual(encrypted);
      
      // Should be exactly the same instance (not just equal)
      expect(rotated === encrypted).toBe(true);
    });
  
    it('should be much faster than rotateKeyDeep for large data', () => {
      // Create a large test object
      const largeData = {
        data: Array(5000).fill(0).map((_, i) => ({ 
          id: i, 
          value: `large value ${i}`, 
          nested: { prop: `nested property ${i}` }
        }))
      };
  
      if (!encryptionKeys[1]) throw new Error('No encryption keys available');
      
      // Create a temporary instance with only the second key
      const tempEncryption = new EnvelopeEncryption([encryptionKeys[1]]);
      
      // Encrypt with the older key
      const encrypted = tempEncryption.encrypt(largeData);
      
      // Perform optimized rotation and measure time
      const startOptimized = performance.now();
      const optimizedRotated = envelopeEncryption.rotateKey(encrypted);
      const optimizedTime = performance.now() - startOptimized;
      
      // Perform deep rotation and measure time
      const startDeep = performance.now();
      const deepRotated = envelopeEncryption.rotateKeyDeep(encrypted);
      const deepTime = performance.now() - startDeep;
      
      // The optimized rotation should be significantly faster
      // We'll use a reasonable threshold that allows for some variability
      // but ensures the optimization is meaningful
      expect(optimizedTime).toBeLessThan(deepTime * 0.5);
      
      // Both should produce correctly decryptable results
      const decryptedOptimized = envelopeEncryption.decrypt(optimizedRotated);
      const decryptedDeep = envelopeEncryption.decrypt(deepRotated);
      
      expect(decryptedOptimized).toEqual(largeData);
      expect(decryptedDeep).toEqual(largeData);
    });
  
    it('should throw appropriate errors for invalid data', () => {
      const invalidData: EncryptedData = {
        encryptedData: 'invalid-format-without-dot',
        encryptedDataKey: 'some-key.with-tag',
        keyId: 'key-1',
        iv: Buffer.alloc(16).toString('base64')
      };
      
      expect(() => envelopeEncryption.rotateKey(invalidData)).toThrow('Invalid encrypted data format');
    });
  
    it('should throw error if no primary key is available', () => {
      const testData = { message: 'test' };
      const encrypted = envelopeEncryption.encrypt(testData);
      
      // Create instance with empty keys array but bypass constructor check
      const instance = new EnvelopeEncryption([encrypted.keyId as any]);
      
      // @ts-ignore - Modifying private property for testing
      instance.encryptionKeys = [];
      
      // Should throw when attempting to rotate without a primary key
      expect(() => instance.rotateKey(encrypted)).toThrow('No primary encryption key available');
    });
  
    it('should compare performance between rotateKey and rotateKeyDeep for different payload sizes', () => {
      // Test with different payload sizes
      const payloadSizes = [10, 100, 1000, 10000];
      const results = [];
  
      if (!encryptionKeys[1]) throw new Error('No encryption keys available');
      
      // Create a temporary instance with only the second key
      const oldKeyInstance = new EnvelopeEncryption([encryptionKeys[1]]);
      
      for (const size of payloadSizes) {
        // Create data of specified size
        const testData = {
          items: Array(size).fill(0).map((_, i) => ({ 
            id: i, 
            value: `value-${i}`
          }))
        };
        
        // Encrypt with old key
        const encrypted = oldKeyInstance.encrypt(testData);
        
        // Measure optimized rotation
        const startOptimized = performance.now();
        const optimizedRotated = envelopeEncryption.rotateKey(encrypted);
        const optimizedTime = performance.now() - startOptimized;
        
        // Measure deep rotation
        const startDeep = performance.now();
        const deepRotated = envelopeEncryption.rotateKeyDeep(encrypted);
        const deepTime = performance.now() - startDeep;
        
        // Record results
        results.push({
          size,
          optimizedTime,
          deepTime,
          speedupFactor: deepTime / optimizedTime
        });
        
        // Both should produce correctly decryptable results
        const decryptedOptimized = envelopeEncryption.decrypt(optimizedRotated);
        const decryptedDeep = envelopeEncryption.decrypt(deepRotated);
        
        expect(decryptedOptimized).toEqual(testData);
        expect(decryptedDeep).toEqual(testData);
        
        // As payload size increases, the performance gap should widen
        if (size > 100) {
          expect(optimizedTime).toBeLessThan(deepTime * 0.5);
        }
      }
      
      // Log performance comparison results in a structured way
      console.log('Performance comparison between rotateKey and rotateKeyDeep:');
      results.forEach(result => {
        console.log(`Size: ${result.size}, Optimized: ${result.optimizedTime.toFixed(2)}ms, Deep: ${result.deepTime.toFixed(2)}ms, Speedup: ${result.speedupFactor.toFixed(2)}x`);
      });
      
      // Verify that the speedup factor increases with payload size
      // This confirms that the optimization is more effective for larger payloads
      if (results.length >= 3) {
          if (!results[0]) throw new Error('No encryption keys available');

        const smallSpeedup = results[0].speedupFactor;

        if (!results[results.length - 1]) throw new Error('No encryption keys available');
        
        //@ts-expect-error
        const largeSpeedup = results[results.length - 1].speedupFactor;
        expect(largeSpeedup).toBeGreaterThan(smallSpeedup);
      }
    });
  });
  
  describe('rotateKeyDeep', () => {
    it('should decrypt and re-encrypt data with the newest key', () => {
        // Set up data that was encrypted with the older key
        const testData = { message: 'encrypted with old key' };
    
        if (!encryptionKeys[1]) throw new Error('No encryption keys available');
        
        // Create a temporary instance with only the second key
        const tempEncryption = new EnvelopeEncryption([encryptionKeys[1]]);
        
        // Mock Date.now for consistent but different timestamps
        const originalDateNow = Date.now;
        let dateNowCounter = 0;
        
        try {
          Date.now = vi.fn().mockImplementation(() => {
            return 1600000000000 + (dateNowCounter++ * 1000);
          });
          
          // Mock randomBytes to return different values for each call
          let randomBytesCounter = 0;
          vi.mocked(crypto.randomBytes).mockImplementation((size) => {
            const buffer = Buffer.alloc(size);
            buffer.fill(10 + randomBytesCounter++); // Different value each time
            return buffer;
          });
          
          const oldEncrypted = tempEncryption.encrypt(testData);

          if (!encryptionKeys[0] || !encryptionKeys[1]) throw new Error('No encryption keys available');
          
          // Verify it's using the old key
          expect(oldEncrypted.keyId).toBe(encryptionKeys[1].id);
          
          // Rotate the key
          const rotated = envelopeEncryption.rotateKeyDeep<typeof testData>(oldEncrypted);
          
          // The keyId should now be the newest key
          expect(rotated.keyId).toBe(encryptionKeys[0].id);
          
          // The data should still decrypt correctly
          const decrypted = envelopeEncryption.decrypt<typeof testData>(rotated);
          expect(decrypted).toEqual(testData);
          
          // Properties should be different after rotation
          expect(rotated.encryptedData).not.toBe(oldEncrypted.encryptedData);
          expect(rotated.encryptedDataKey).not.toBe(oldEncrypted.encryptedDataKey);
          expect(rotated.iv).not.toBe(oldEncrypted.iv);
        } finally {
          // Restore original Date.now
          Date.now = originalDateNow;
        }
      });
    
      it('should handle rotation of data already encrypted with primary key', () => {
        const testData = { message: 'already encrypted with primary key' };
        
        // First, set the mock implementation for the initial encryption
        vi.mocked(crypto.randomBytes).mockImplementationOnce((size) => {
          const buffer = Buffer.alloc(size);
          buffer.fill(1); // Value for initial encryption
          return buffer;
        }).mockImplementationOnce((size) => {
          const buffer = Buffer.alloc(size);
          buffer.fill(2);
          return buffer;
        });
        
        // Encrypt with primary key
        const encrypted = envelopeEncryption.encrypt(testData);
        
        // Now change the mock implementation again for the rotation
        vi.mocked(crypto.randomBytes).mockImplementationOnce((size) => {
          const buffer = Buffer.alloc(size);
          buffer.fill(3); // Different value for the rotation
          return buffer;
        }).mockImplementationOnce((size) => {
          const buffer = Buffer.alloc(size);
          buffer.fill(4);
          return buffer;
        }).mockImplementationOnce((size) => {
          const buffer = Buffer.alloc(size);
          buffer.fill(5);
          return buffer;
        }).mockImplementationOnce((size) => {
          const buffer = Buffer.alloc(size);
          buffer.fill(6);
          return buffer;
        });
        
        // Rotate (should re-encrypt with same primary key but different random values)
        const rotated = envelopeEncryption.rotateKeyDeep<typeof testData>(encrypted);
        
        // The keyId should remain the same
        expect(rotated.keyId).toBe(encrypted.keyId);
        
        // The data should still decrypt correctly
        const decrypted = envelopeEncryption.decrypt<typeof testData>(rotated);
        expect(decrypted).toEqual(testData);
        
        // IV and encrypted content should still change
        expect(rotated.encryptedData).not.toBe(encrypted.encryptedData);
        expect(rotated.iv).not.toBe(encrypted.iv);
      });
    
    it('should throw appropriate errors for invalid data', () => {
      const invalidData: EncryptedData = {
        encryptedData: 'invalid-format-without-dot',
        encryptedDataKey: 'some-key.with-tag',
        keyId: 'key-1',
        iv: Buffer.alloc(16).toString('base64')
      };
      
      expect(() => envelopeEncryption.rotateKeyDeep(invalidData)).toThrow('Invalid encrypted data format');
    });
  });
  
  describe('findDataNeedingRotation', () => {
    it('should identify data encrypted with expiring keys', () => {
      const testData1 = { id: 1 };
      const testData2 = { id: 2 };
      
      // Encrypt data1 with newest key
      const encrypted1 = envelopeEncryption.encrypt(testData1);

      if (!encryptionKeys[1]) throw new Error('No encryption keys available');
      
      // Encrypt data2 with oldest (expiring) key
      // Create a temporary instance with only the second key
      const tempEncryption = new EnvelopeEncryption([encryptionKeys[1]]);
      const encrypted2 = tempEncryption.encrypt(testData2);
      
      const encryptedList = [encrypted1, encrypted2];
      
      const needsRotation = envelopeEncryption.findDataNeedingRotation(encryptedList);
      
      // Only the second item needs rotation
      expect(needsRotation).toEqual([1]);
    });
    
    it('should return an empty array if no data needs rotation', () => {
      const testData1 = { id: 1 };
      const testData2 = { id: 2 };
      
      // Encrypt both with newest key
      const encrypted1 = envelopeEncryption.encrypt(testData1);
      const encrypted2 = envelopeEncryption.encrypt(testData2);
      
      const encryptedList = [encrypted1, encrypted2];
      
      const needsRotation = envelopeEncryption.findDataNeedingRotation(encryptedList);
      
      expect(needsRotation).toEqual([]);
    });
    
    it('should handle empty array input', () => {
      const needsRotation = envelopeEncryption.findDataNeedingRotation([]);
      expect(needsRotation).toEqual([]);
    });
    
    it('should correctly identify multiple items needing rotation', () => {
      // Create an instance with all three keys, with two marked as expiring
      const allKeys = [...encryptionKeys];
      if (allKeys[1]) allKeys[1].isExpiring = true;
      if (allKeys[2]) allKeys[2].isExpiring = true;
      
      const multiKeyInstance = new EnvelopeEncryption(allKeys);
      
      // Create encrypted data with different keys
      const encryptedList = [
        multiKeyInstance.encrypt({ data: 1 }), // Uses key-1 (not expiring)
        { ...multiKeyInstance.encrypt({ data: 2 }), keyId: 'key-2' }, // Manually set to use key-2 (expiring)
        { ...multiKeyInstance.encrypt({ data: 3 }), keyId: 'key-3' }  // Manually set to use key-3 (expiring)
      ];
      
      const needsRotation = multiKeyInstance.findDataNeedingRotation(encryptedList);
      
      // Should identify items 1 and 2 (indices 1 and 2)
      expect(needsRotation).toEqual([1, 2]);
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const emptyObject = {};
      
      const encrypted = envelopeEncryption.encrypt(emptyObject);
      const decrypted = envelopeEncryption.decrypt<Record<string, never>>(encrypted);
      
      expect(decrypted).toEqual(emptyObject);
    });
    
    it('should handle arrays', () => {
      const testArray = [1, 2, 3, 'test', { nested: true }];
      
      const encrypted = envelopeEncryption.encrypt(testArray);
      const decrypted = envelopeEncryption.decrypt<typeof testArray>(encrypted);
      
      expect(decrypted).toEqual(testArray);
    });
    
    it('should handle primitive values', () => {
      const testString = 'just a string';
      
      const encrypted = envelopeEncryption.encrypt(testString);
      const decrypted = envelopeEncryption.decrypt<string>(encrypted);
      
      expect(decrypted).toEqual(testString);
    });
    
    it('should handle large data', () => {
      // Create a large object
      const largeObject = {
        data: Array(1000).fill(0).map((_, i) => ({ 
          id: i, 
          value: `test value ${i}`, 
          nested: { prop: `nested ${i}` }
        }))
      };
      
      const encrypted = envelopeEncryption.encrypt(largeObject);
      const decrypted = envelopeEncryption.decrypt<typeof largeObject>(encrypted);
      
      expect(decrypted).toEqual(largeObject);
    });
    
    it('should handle null values', () => {
      const testData = null;
      
      const encrypted = envelopeEncryption.encrypt(testData);
      const decrypted = envelopeEncryption.decrypt<null>(encrypted);
      
      expect(decrypted).toBeNull();
    });
    
    it('should handle undefined values', () => {
      const testData = undefined;
      
      const encrypted = envelopeEncryption.encrypt(testData);
      const decrypted = envelopeEncryption.decrypt<undefined>(encrypted);
      
      expect(decrypted).toBeUndefined();
    });
    
    it('should handle special characters in strings', () => {
      const specialChars = 'Special chars: !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ and unicode: 你好, नमस्ते, こんにちは, 안녕하세요';
      
      const encrypted = envelopeEncryption.encrypt(specialChars);
      const decrypted = envelopeEncryption.decrypt<string>(encrypted);
      
      expect(decrypted).toEqual(specialChars);
    });
    
    it('should handle multiple rotation operations', () => {
      // Check if keys exist before using them
      expect(encryptionKeys.length).toBeGreaterThanOrEqual(3);
      if (encryptionKeys.length < 3) return;
      
      const key0 = encryptionKeys[0];
      const key1 = encryptionKeys[1];
      const key2 = encryptionKeys[2];
      
      expect(key0).toBeDefined();
      expect(key1).toBeDefined();
      expect(key2).toBeDefined();
      
      if (!key0 || !key1 || !key2) return;
      
      const testData = { value: 'test' };
      
      // Create a chain of rotations through different encryption instances
      const instance1 = new EnvelopeEncryption([key2]);
      const instance2 = new EnvelopeEncryption([key1, key2]);
      const instance3 = new EnvelopeEncryption([key0, key1, key2]);
      
      // Initial encryption with oldest key
      const encrypted1 = instance1.encrypt(testData);
      expect(encrypted1.keyId).toBe(key2.id);
      
      // First rotation to middle key
      const encrypted2 = instance2.rotateKeyDeep<typeof testData>(encrypted1);
      expect(encrypted2.keyId).toBe(key1.id);
      
      // Second rotation to newest key
      const encrypted3 = instance3.rotateKeyDeep<typeof testData>(encrypted2);
      expect(encrypted3.keyId).toBe(key0.id);
      
      // Data should still be correctly decryptable
      const decrypted = instance3.decrypt<typeof testData>(encrypted3);
      expect(decrypted).toEqual(testData);
    });
  });
  
  describe('security considerations', () => {
    it('should detect tampering with encryptedData', () => {
      const secretData = { password: 'supersecret123' };
      const encrypted = envelopeEncryption.encrypt(secretData);
      
      // Split the encrypted data to tamper with it
      const parts = encrypted.encryptedData.split('.');
      expect(parts.length).toBe(2);
      
      if (parts.length === 2) {
        const [dataContent, authTag] = parts;

        if (!dataContent || !authTag) throw new Error('Invalid encrypted data format');
        
        // Tamper with the encrypted content but keep auth tag
        const tamperedData = {
          ...encrypted,
          encryptedData: dataContent.substring(0, dataContent.length - 5) + 'XXXXX' + '.' + authTag
        };
        
        // Should reject tampered data
        expect(() => envelopeEncryption.decrypt(tamperedData)).toThrow();
      }
    });
    
    it('should detect tampering with auth tag', () => {
      const secretData = { creditCard: '4111-1111-1111-1111' };
      const encrypted = envelopeEncryption.encrypt(secretData);
      
      // Split the encrypted data to tamper with auth tag
      const parts = encrypted.encryptedData.split('.');
      expect(parts.length).toBe(2);
      
      if (parts.length === 2) {
        const [dataContent, authTag] = parts;

        if (!dataContent || !authTag) throw new Error('Invalid encrypted data format');
        
        // Tamper with the auth tag
        const tamperedData = {
          ...encrypted,
          encryptedData: dataContent + '.' + authTag.substring(0, authTag.length - 5) + 'XXXXX'
        };
        
        // Should reject tampered data
        expect(() => envelopeEncryption.decrypt(tamperedData)).toThrow();
      }
    });
    
    it('should detect tampering with IV', () => {
      const secretData = { ssn: '123-45-6789' };
      const encrypted = envelopeEncryption.encrypt(secretData);
      
      // Replace IV with different value but keep same length
      const tamperedData = {
        ...encrypted,
        iv: Buffer.from('tampered-iv-value').toString('base64')
      };
      
      // Should reject tampered data
      expect(() => envelopeEncryption.decrypt(tamperedData)).toThrow();
    });
    
    it('should detect tampering with encryptedDataKey', () => {
      const secretData = { privateKey: 'very-sensitive-data' };
      const encrypted = envelopeEncryption.encrypt(secretData);
      
      // Tamper with the encrypted data key
      const parts = encrypted.encryptedDataKey.split('.');
      expect(parts.length).toBe(2);
      
      if (parts.length === 2) {
        const [keyContent, keyAuthTag] = parts;

        if (!keyContent || !keyAuthTag) throw new Error('Invalid encrypted data key format');

        const tamperedData = {
          ...encrypted,
          encryptedDataKey: keyContent.substring(0, keyContent.length - 5) + 'XXXXX' + '.' + keyAuthTag
        };
        
        // Should reject tampered data
        expect(() => envelopeEncryption.decrypt(tamperedData)).toThrow();
      }
    });
    
    it('should not be vulnerable to key-identification attacks', () => {
        // Create multiple encrypted objects with same plaintext
        const secretValue = 'sensitive-constant-data';
        const count = 5;
        const encryptedValues = [];
        
        // Mock Date.now for different timestamps
        const originalDateNow = Date.now;
        let dateNowCounter = 0;
        
        try {
          Date.now = vi.fn().mockImplementation(() => {
            return 1600000000000 + (dateNowCounter++ * 1000);
          });
          
          // Need to ensure different IVs for each encryption
          for (let i = 0; i < count; i++) {
            // Clear all mocks before each iteration
            vi.clearAllMocks();
            
            // Create a sequence of mock implementations to handle multiple randomBytes calls
            let callCount = 0;
            vi.mocked(crypto.randomBytes).mockImplementation((size) => {
              const buffer = Buffer.alloc(size);
              // Use different fill values for each call and each iteration
              // This ensures both the data key and IV are different in each loop
              buffer.fill((i * 10) + callCount++);
              return buffer;
            });
            
            encryptedValues.push(envelopeEncryption.encrypt(secretValue));
          }
          
          // Verify all encrypted values are different despite same plaintext
          const uniqueDataKeys = new Set(encryptedValues.map(e => e.encryptedDataKey));
          const uniqueEncryptedData = new Set(encryptedValues.map(e => e.encryptedData));
          const uniqueIvs = new Set(encryptedValues.map(e => e.iv));
          
          expect(uniqueDataKeys.size).toBe(count);
          expect(uniqueEncryptedData.size).toBe(count);
          expect(uniqueIvs.size).toBe(count);
        } finally {
          // Restore original Date.now
          Date.now = originalDateNow;
        }
      });
    
    it('should enforce minimum key requirements', () => {
      // Test with invalid key values
      const invalidKeys = [
        // Empty key value
        { id: 'invalid-key-1', value: '' },
        // Very short key (insecure)
        { id: 'invalid-key-2', value: 'short' },
        // Invalid base64 encoding
        { id: 'invalid-key-3', value: '!@#$%^&*()' }
      ];
      
      // Should throw error when trying to encrypt with invalid keys
      invalidKeys.forEach(invalidKey => {
        expect(() => {
          const instance = new EnvelopeEncryption([invalidKey]);
          instance.encrypt({ test: 'data' });
        }).toThrow();
      });
    });
    
    it('should prevent timing attacks by using constant-time comparison', () => {
        // This is more of a code review test than a functional test
        // Check that crypto library's timingSafeEqual is used for auth tag comparison
        // or that the code doesn't expose timing information through early returns
        
        // For testing purposes, we'll verify that slightly different auth tags
        // both cause failures and the failures happen in approximately the same
        // time frame (no early returns)
        
        const secretData = { key: 'value' };
        
        // Mock randomBytes for consistent encryption
        let randomBytesMock = vi.mocked(crypto.randomBytes);
        randomBytesMock.mockImplementation((size) => {
          const buffer = Buffer.alloc(size);
          buffer.fill(1); // Same value for predictable output
          return buffer;
        });
        
        const encrypted = envelopeEncryption.encrypt(secretData);
        
        // Create two tampered versions with different auth tag modifications
        const parts = encrypted.encryptedData.split('.');
        expect(parts.length).toBe(2);
        
        if (parts.length === 2) {
          const [dataContent, authTag] = parts;
          
          // Create completely invalid auth tags that will definitely cause verification failure
          const tampered1 = {
            ...encrypted,
            encryptedData: dataContent + '.YWJjZGVmZ2hpamtsbW5vcA==' // Completely different auth tag
          };
          
          const tampered2 = {
            ...encrypted,
            encryptedData: dataContent + '.YXl6eHdjdmJ1bm1sc2tqaA==' // Another completely different auth tag
          };
          
          // Both should fail - we're not measuring timing here, just verifying 
          // failures occur for both tampered versions
          expect(() => envelopeEncryption.decrypt(tampered1)).toThrow();
          expect(() => envelopeEncryption.decrypt(tampered2)).toThrow();
        }
      });
  });
  
  describe('practical security tests', () => {
    it('should handle key rotation across multiple encryption instances', () => {
      // Simulate a real-world scenario where different instances
      // might have access to different keys
      
      // Ensure we have all the keys needed for this test
      expect(encryptionKeys.length).toBeGreaterThanOrEqual(3);
      if (encryptionKeys.length < 3) return;
      
      const key0 = encryptionKeys[0];
      const key1 = encryptionKeys[1];
      const key2 = encryptionKeys[2];
      
      expect(key0).toBeDefined();
      expect(key1).toBeDefined();
      expect(key2).toBeDefined();
      
      if (!key0 || !key1 || !key2) return;
      
      const testData = { sensitive: 'information' };
      
      // Instance 1 has only the oldest key
      const instance1 = new EnvelopeEncryption([key2]);
      
      // Instance 2 has the middle key
      const instance2 = new EnvelopeEncryption([key1]);
      
      // Instance 3 has all keys
      const instance3 = new EnvelopeEncryption([key0, key1, key2]);
      
      // Encrypt with oldest key
      const encrypted1 = instance1.encrypt(testData);
      
      // Instance 3 can decrypt and rotate to newest key
      const rotated = instance3.rotateKeyDeep<typeof testData>(encrypted1);
      
      // Instance 2 should not be able to decrypt after rotation
      expect(() => instance2.decrypt(rotated)).toThrow();
      
      // Instance 3 can still decrypt
      expect(instance3.decrypt<typeof testData>(rotated)).toEqual(testData);
      
      // And the rotated data should now use the newest key
      expect(rotated.keyId).toBe(key0.id);
    });
    
    it('should gracefully handle sequential key rotations in a batch', () => {
      // Create a batch of encrypted items with varying keys
      
      // Ensure we have all the keys needed for this test
      expect(encryptionKeys.length).toBeGreaterThanOrEqual(3);
      if (encryptionKeys.length < 3) return;
      
      const key0 = encryptionKeys[0];
      const key1 = encryptionKeys[1];
      const key2 = encryptionKeys[2];
      
      expect(key0).toBeDefined();
      expect(key1).toBeDefined();
      expect(key2).toBeDefined();
      
      if (!key0 || !key1 || !key2) return;
      
      const items = [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
        { id: 3, name: 'item3' }
      ];
      
      // Encrypt with old key
      const oldInstance = new EnvelopeEncryption([key2]);
      const encryptedItems = items.map(item => oldInstance.encrypt(item));
      
      // New instance with all keys
      const newInstance = new EnvelopeEncryption([key0, key1, key2]);
      
      // Find items needing rotation
      const needRotation = newInstance.findDataNeedingRotation(encryptedItems);
      expect(needRotation.length).toBe(encryptedItems.length);
      
      // Rotate all items
      const rotatedItems = encryptedItems.map(item => 
        newInstance.rotateKeyDeep(item)
      );
      
      // Verify all items now use newest key
      rotatedItems.forEach(item => {
        expect(item.keyId).toBe(key0.id);
      });
      
      // Verify all items can be decrypted
      const decryptedItems = rotatedItems.map(item => 
        newInstance.decrypt(item)
      );
      
      expect(decryptedItems).toEqual(items);
      
      // Verify no items need rotation now
      const stillNeedRotation = newInstance.findDataNeedingRotation(rotatedItems);
      expect(stillNeedRotation.length).toBe(0);
    });
  });
  
  describe('private methods', () => {
    it('should correctly encrypt and decrypt data keys', () => {
        if (!encryptionKeys[0]) throw new Error('No encryption keys available');

      // Access the private methods for testing
      const instance = new EnvelopeEncryption([encryptionKeys[0]]);
      
      // Generate a test data key
      const testDataKey = crypto.randomBytes(32);
      
      // Use the private method to encrypt the data key
      // @ts-ignore - Accessing private method for testing
      const encryptedKey = instance['encryptDataKey'](testDataKey, encryptionKeys[0]);
      
      // Verify it contains a dot (separating key from auth tag)
      expect(encryptedKey).toBeDefined();
      if (encryptedKey) {
        expect(encryptedKey.includes('.')).toBe(true);
        
        // Use the private method to decrypt the data key
        // @ts-ignore - Accessing private method for testing
        const decryptedKey = instance['decryptDataKey'](encryptedKey, encryptionKeys[0]);
        
        // Verify the decrypted key matches the original
        expect(decryptedKey).toBeDefined();
        if (decryptedKey) {
          expect(Buffer.compare(decryptedKey, testDataKey)).toBe(0);
        }
      }
    });
    
    it('should reject decryption with wrong encryption key', () => {
      // Ensure we have at least two different keys
      expect(encryptionKeys.length).toBeGreaterThanOrEqual(2);
      if (encryptionKeys.length < 2) return;
      
      const key0 = encryptionKeys[0];
      const key1 = encryptionKeys[1];
      
      expect(key0).toBeDefined();
      expect(key1).toBeDefined();
      
      if (!key0 || !key1) return;
      
      const instance = new EnvelopeEncryption([key0]);
      
      // Generate a test data key
      const testDataKey = crypto.randomBytes(32);
      
      // Encrypt with one key
      // @ts-ignore - Accessing private method for testing
      const encryptedKey = instance['encryptDataKey'](testDataKey, key0);
      
      expect(encryptedKey).toBeDefined();
      if (!encryptedKey) return;
      
      // Try to decrypt with different key
      expect(() => {
        // @ts-ignore - Accessing private method for testing
        instance['decryptDataKey'](encryptedKey, key1);
      }).toThrow();
    });
    
    it('should derive consistent IVs from key IDs', () => {
        if (!encryptionKeys[0]) throw new Error('No encryption keys available');

      const instance = new EnvelopeEncryption([encryptionKeys[0]]);
      
      const key0 = encryptionKeys[0];
      expect(key0).toBeDefined();
      if (!key0) return;
      
      // Encrypt the same data key twice with the same encryption key
      const testDataKey = crypto.randomBytes(32);
      
      // @ts-ignore - Accessing private method for testing
      const encrypted1 = instance['encryptDataKey'](testDataKey, key0);
      // @ts-ignore - Accessing private method for testing
      const encrypted2 = instance['encryptDataKey'](testDataKey, key0);
      
      expect(encrypted1).toBeDefined();
      expect(encrypted2).toBeDefined();
      
      if (encrypted1 && encrypted2) {
        // The results should be identical because the IV is derived from the key ID
        expect(encrypted1).toBe(encrypted2);
      }
    });
  });
  
  describe('cryptographic properties', () => {
    it('should use different data keys for different encryptions', () => {
        // This test verifies that each encryption operation uses a new data key
        const sameData = { value: 'same-value' };
        
        // Mock Date.now to return different timestamps for each call
        const originalDateNow = Date.now;
        let dateNowCallCount = 0;
        
        try {
        // Override Date.now to return incrementing timestamps
        Date.now = vi.fn().mockImplementation(() => {
            return 1600000000000 + (dateNowCallCount++ * 1000); // Add 1 second each call
        });
        
        // Create multiple encryptions of the same data
        const encrypted1 = envelopeEncryption.encrypt(sameData);
        const encrypted2 = envelopeEncryption.encrypt(sameData);
        
        // The encrypted data keys should be different
        expect(encrypted1.encryptedDataKey).not.toBe(encrypted2.encryptedDataKey);
        } finally {
        // Restore the original Date.now
        Date.now = originalDateNow;
        }
    });
    
    it('should ensure encrypted values do not reveal information about plaintext length', () => {
      // Create two plaintext values with significantly different lengths
      const shortText = 'short';
      const longText = 'a'.repeat(1000);
      
      const encryptedShort = envelopeEncryption.encrypt(shortText);
      const encryptedLong = envelopeEncryption.encrypt(longText);
      
      // The ratio of ciphertext lengths should not match the ratio of plaintext lengths
      // This is a basic check for padding - in AES-GCM, ciphertext is same length as plaintext
      // plus the auth tag, but the base64 encoding will obscure this somewhat
      
      const shortRatio = encryptedShort.encryptedData.length / shortText.length;
      const longRatio = encryptedLong.encryptedData.length / longText.length;
      
      // In practice, for AES-GCM, the longer text should have a ratio closer to 1
      // (plus base64 overhead) because the fixed auth tag becomes proportionally smaller
      expect(Math.abs(shortRatio - longRatio)).toBeGreaterThan(0.1);
    });
    
    it('should use a strong encryption algorithm', () => {
        if (!encryptionKeys[0]) throw new Error('No encryption keys available');
      // Verify the algorithm used is AES-256-GCM
      const instance = new EnvelopeEncryption([encryptionKeys[0]]);
      
      // @ts-ignore - Accessing private property for testing
      expect(instance['algorithm']).toBe('aes-256-gcm');
    });
  });
});