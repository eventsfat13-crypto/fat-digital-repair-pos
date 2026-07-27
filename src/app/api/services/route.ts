import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.repairService.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    const inspectionItems = await prisma.inspectionItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ services, inspectionItems });
  } catch (error) {
    console.error('Services error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'service') {
      const service = await prisma.repairService.create({
        data: { name: data.name, category: data.category, sortOrder: data.sortOrder || 0 },
      });
      return NextResponse.json(service, { status: 201 });
    }

    if (type === 'inspection') {
      const item = await prisma.inspectionItem.create({
        data: { name: data.name, category: data.category, sortOrder: data.sortOrder || 0 },
      });
      return NextResponse.json(item, { status: 201 });
    }

    return NextResponse.json({ error: 'Specify type: service or inspection' }, { status: 400 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
