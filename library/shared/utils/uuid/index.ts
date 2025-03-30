/**
 * UUID7 Generator with feature detection and fallback
 * Based on RFC 4122 and draft-ietf-uuidrev-rfc4122bis-12
 */

/**
 * UUID7 - String manipulation implementation
 * 
 * Creates a UUID7 through string manipulation and hex formatting
 * This implementation is more compatible with older environments
 * 
 * @returns string - UUID7 compliant identifier
 */
export function UUID7(): string {
    // Utility function to convert number to hex with padding
    function hex(number: number, len: number): string {
      return number.toString(16).padStart(len, '0');
    }
  
    // Utility function to generate random numbers with limited bits
    function random(bits: number): number {
      // IEEE-754 mantissa: 52 bits
      if (bits > 52) { bits = 52; }
      return Math.floor(Math.random() * Math.pow(2, bits));
    }
    
    let uuid = "";
    
    // Generate time chars
    const milli = Date.now();
    const time = hex(milli, 12);
    
    // Assemble UUID from time and random components
    uuid += time.substring(0, 8);
    uuid += "-";
    uuid += time.substring(8, 12);
    uuid += "-";
    uuid += hex(random(16), 4);
    uuid += "-";
    uuid += hex(random(16), 4);
    uuid += "-";
    uuid += hex(random(48), 12);
    
    // Set version and variant
    const uuidChars = uuid.split('');
    uuidChars[14] = '7'; // Set version to 7
    
    // Set variant (8, 9, a, or b)
    const variantChars: string[] = ['8', '9', 'a', 'b'];
    const variantIndex = random(2) % variantChars.length;

    const variantChar = variantChars[variantIndex];

    if (!variantChar) {
        throw new Error('Variant character not found');
    }

    uuidChars[19] = variantChar; // Set variant to 8, 9, a, or b
    
    return uuidChars.join('');
}