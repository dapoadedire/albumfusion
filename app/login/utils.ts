// utils.ts

/**
 * Computes the SHA-256 hash of the given string.
 * @param plain The input string to hash.
 * @returns A Promise that resolves to an ArrayBuffer containing the hash.
 */
export async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  }
  
  /**
   * Encodes an ArrayBuffer to a URL-safe base64 string.
   * @param input The ArrayBuffer to encode.
   * @returns A URL-safe base64 encoded string.
   */
  export function base64encode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  
  /**
   * Generates a random string of the specified length.
   * @param length The length of the random string to generate.
   * @returns A random string.
   */
  export function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map(x => possible[x % possible.length])
      .join('');
  }