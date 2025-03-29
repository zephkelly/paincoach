/**
 * UUID7 Generator with feature detection and fallback
 * Based on RFC 4122 and draft-ietf-uuidrev-rfc4122bis-12
 */

export const UUID7 = (function() {
    // Feature detection for BigInt support
    const hasBigInt = typeof BigInt !== 'undefined';
    
    // Utility functions for the fallback implementation
    function hex(number: number, len: number): string {
      return number.toString(16).padStart(len, '0');
    }
  
    function random(bits: number): number {
      // IEEE-754 mantissa: 52 bits
      if (bits > 52) { bits = 52 }
      return Math.floor(Math.random() * Math.pow(2, bits));
    }
    
    // Modern implementation (BigInt-based)
    function bigRandom(bits: number): bigint {
      // IEEE-754 mantissa: 52 bits
      if (bits > 52) { bits = 52 }
      return BigInt(Math.floor(Math.random() * 2 ** bits));
    }
      
    function toUUIDString(bignum: bigint): string {
      const digits = bignum.toString(16).padStart(32, "0");
      return `${digits.substring(0, 8)
            }-${digits.substring(8, 12)
            }-${digits.substring(12, 16)
            }-${digits.substring(16, 20)
            }-${digits.substring(20, 32)}`;
    }
  
    function modernUUID7(): string {
      const milli = Date.now();
      return toUUIDString(
        BigInt(milli) << 80n | // Time
        (7n << 76n)         | // Version
        bigRandom(12) << 64n | // Random A
        (1n << 63n)         | // Variant
        bigRandom(14) << 48n | // Random B
        bigRandom(48)          // Random B
      );
    }
    
    // Compatibility implementation (string-based)
    function compatUUID7(): string {
      let uuid = "";
      
      // generate time chars
      const milli = Date.now();
      const time = hex(milli, 12);
      
      // cat time and random chars
      uuid += time.substring(0, 8);
      uuid += "-";
      uuid += time.substring(8, 12);
      uuid += "-";
      uuid += hex(random(16), 4);
      uuid += "-";
      uuid += hex(random(16), 4);
      uuid += "-";
      uuid += hex(random(48), 12);
      
      // version and variant
      const uuidChars = uuid.split('');
      uuidChars[14] = '7'; // Set version to 7
      
      // Set variant (8, 9, a, or b) - using a safe approach for TypeScript
      const variantChars: string[] = ['8', '9', 'a', 'b'];
      const variantIndex = random(2) % variantChars.length;
      // Using type assertion to tell TypeScript this is safe
      const variantChar = variantChars[variantIndex] as string;
      uuidChars[19] = variantChar;
      
      return uuidChars.join('');
    }
    
    // Return the appropriate function based on environment support
    return {
      generate: function(): string {
        if (hasBigInt) {
          try {
            return modernUUID7();
          } catch (e) {
            // Fallback in case of unexpected errors
            return compatUUID7();
          }
        }
        return compatUUID7();
      },
      // Expose implementations for testing or direct access
      modernImplementation: hasBigInt ? modernUUID7 : null,
      compatImplementation: compatUUID7
    };
})();