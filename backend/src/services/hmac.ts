import { createHmac } from 'crypto';

/*
 * Generates a unique HMAC signature for a specific participant in a specific event.
 * @param id - The unique ID of the participant
 * @param slug - The event identifier
 * @returns A 64-character hex string (SHA-256)
 */

export const generateToken = (id: string, slug: string): string => {
  const secret = process.env.HMAC_SECRET!;
  
  // combined id + slug to ensure that even if two events have the same participant IDs, the tokens will be completely different.
  return createHmac('sha256', secret)
    .update(`${id}-${slug}`)
    .digest('hex');
};

// Validates a signature against the expected signature.
export const verifyToken = (id: string, slug: string, token: string): boolean => {
  const expectedToken = generateToken(id, slug);
  return expectedToken === token;
};