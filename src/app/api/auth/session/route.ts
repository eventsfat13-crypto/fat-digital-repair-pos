import { NextResponse } from 'next/server';
import { getSession, clearTokenCookie } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const response = NextResponse.json({
    user: {
      userId: session.userId,
      username: session.username,
      role: session.role,
      displayName: session.displayName,
    },
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(clearTokenCookie());
  return response;
}
