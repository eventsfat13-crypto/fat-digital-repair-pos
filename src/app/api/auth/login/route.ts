import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createToken, setTokenCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.isLocked) {
      return NextResponse.json({ error: 'Account is locked. Contact administrator.' }, { status: 403 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Account is deactivated.' }, { status: 403 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        details: `User ${user.username} logged in`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    const token = await createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      displayName: user.displayName,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    });

    response.cookies.set(setTokenCookie(token));
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
