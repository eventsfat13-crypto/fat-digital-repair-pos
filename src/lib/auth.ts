import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fat-digital-repair-pos-jwt-secret-key-2024-enterprise'
);

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  displayName: string;
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('fat-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getSessionFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get('fat-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setTokenCookie(token: string) {
  return {
    name: 'fat-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  };
}

export function clearTokenCookie() {
  return {
    name: 'fat-token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}
