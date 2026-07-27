import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [technicians, total] = await Promise.all([
      prisma.technician.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { assignments: true, repairs: true } },
        },
      }),
      prisma.technician.count({ where }),
    ]);

    return NextResponse.json({
      technicians,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Technicians error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const technician = await prisma.technician.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        skills: data.skills || [],
        experience: data.experience,
        salary: data.salary,
        commission: data.commission,
        workingHours: data.workingHours,
        isAvailable: data.isAvailable ?? true,
      },
    });
    return NextResponse.json(technician, { status: 201 });
  } catch (error) {
    console.error('Create technician error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
