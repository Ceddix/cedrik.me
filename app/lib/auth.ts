import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

export interface AdminUser {
  id: string;
  username: string;
  global_name?: string;
  avatar?: string;
  authenticatedAt: number;
}

const COOKIE_NAME = 'admin_session';

function getSecretKey(): string {
  return process.env.ADMIN_SECRET || '';
}

/**
 * Sign payload string with HMAC-SHA256
 */
export function signSession(payload: AdminUser): string {
  const jsonStr = JSON.stringify(payload);
  const base64 = Buffer.from(jsonStr).toString('base64url');
  const hmac = crypto.createHmac('sha256', getSecretKey()).update(base64).digest('base64url');
  return `${base64}.${hmac}`;
}

/**
 * Verify signed session string
 */
export function verifySession(token: string): AdminUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64, hmac] = parts;
    const expectedHmac = crypto.createHmac('sha256', getSecretKey()).update(base64).digest('base64url');
    
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return null;
    }

    const jsonStr = Buffer.from(base64, 'base64url').toString('utf-8');
    return JSON.parse(jsonStr) as AdminUser;
  } catch {
    return null;
  }
}

/**
 * Get active admin session from cookies
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return null;
  return verifySession(sessionToken);
}

/**
 * Set HTTP-only admin session cookie
 */
export async function setAdminSession(userData: AdminUser) {
  const cookieStore = await cookies();
  const token = signSession(userData);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isRequestAuthorized(request: NextRequest): Promise<boolean> {
  const secretKey = getSecretKey();

  if (secretKey) {
    // 1. Check Bearer / Authorization header or x-api-key
    const authHeader = request.headers.get('authorization') || request.headers.get('x-api-key');
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      if (token === secretKey) {
        return true;
      }
    }

    // 2. Check query param key
    const queryKey = request.nextUrl.searchParams.get('key');
    if (queryKey === secretKey) {
      return true;
    }
  }

  // 3. Check Cookie Session
  const session = await getAdminSession();
  return session !== null;
}
