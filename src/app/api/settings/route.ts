import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.companySettings.findFirst();
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, displayName: true, role: true, isActive: true, isLocked: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    const categories = await prisma.deviceCategory.findMany({ orderBy: { sortOrder: 'asc' } });
    const inventoryCategories = await prisma.inventoryCategory.findMany({ orderBy: { name: 'asc' } });

    return NextResponse.json({
      settings,
      users,
      categories,
      inventoryCategories,
    });
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section === 'company') {
      await prisma.companySettings.upsert({
        where: { id: 'default' },
        create: { ...data, id: 'default' },
        update: data,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
