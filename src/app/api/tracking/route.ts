import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');

    if (!trackingId) {
      return NextResponse.json({ error: 'Tracking ID required' }, { status: 400 });
    }

    const repair = await prisma.repair.findFirst({
      where: { trackingId },
      include: {
        model: true,
        brand: { include: { category: true } },
        primaryTechnician: { select: { name: true, photo: true, skills: true } },
        services: { include: { service: true } },
        parts: true,
        images: { where: { category: { not: 'internal' } }, orderBy: { createdAt: 'desc' } },
        statusHistory: { orderBy: { createdAt: 'desc' }, take: 10 },
        invoice: true,
      },
    });

    if (!repair) {
      return NextResponse.json({ error: 'Repair not found with this tracking ID' }, { status: 404 });
    }

    return NextResponse.json(repair);
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
