import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const includeDrafts = searchParams.get('drafts') === 'true';

    const where: any = {};
    if (!includeDrafts) where.isDraft = false;
    if (status && status !== 'ALL') where.status = status;
    if (query) {
      where.OR = [
        { repairOrderId: { contains: query, mode: 'insensitive' } },
        { trackingId: { contains: query, mode: 'insensitive' } },
        { customerName: { contains: query, mode: 'insensitive' } },
        { customerMobile: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [repairs, total] = await Promise.all([
      prisma.repair.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          brand: true,
          model: true,
          customer: { select: { customerId: true, name: true, mobile: true } },
          primaryTechnician: { select: { id: true, name: true, photo: true } },
          _count: { select: { services: true, parts: true, images: true } },
        },
      }),
      prisma.repair.count({ where }),
    ]);

    return NextResponse.json({
      repairs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Repairs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const repairCount = await prisma.repair.count();
    const year = new Date().getFullYear();
    const repairOrderId = `REP-${year}-${String(repairCount + 1).padStart(6, '0')}`;
    const trackingId = `FAT-${year}-${String(repairCount + 1).padStart(6, '0')}`;

    const repair = await prisma.repair.create({
      data: {
        repairOrderId,
        trackingId,
        status: data.status || 'PENDING',
        priority: data.priority || 'NORMAL',
        isDraft: data.isDraft ?? false,
        step: data.step || 1,
        categoryId: data.categoryId,
        brandId: data.brandId,
        modelId: data.modelId,
        deviceInfo: data.deviceInfo || {},
        customerId: data.customerId,
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        customerEmail: data.customerEmail,
        estimatedTime: data.estimatedTime,
        estimatedDuration: data.estimatedDuration,
        expectedDeliveryAt: data.expectedDeliveryAt,
        countdownStartedAt: data.countdownStartedAt,
        labourCost: data.labourCost || 0,
        partsCost: data.partsCost || 0,
        tax: data.tax || 0,
        discount: data.discount || 0,
        advancePayment: data.advancePayment || 0,
        grandTotal: data.grandTotal || 0,
        remainingBalance: data.remainingBalance || 0,
        primaryTechnicianId: data.primaryTechnicianId,
        complaint: data.complaint,
        repairNotes: data.repairNotes,
      },
    });

    await prisma.statusHistory.create({
      data: {
        repairId: repair.id,
        status: repair.status,
        notes: 'Repair created',
      },
    });

    if (data.customerId && !data.isDraft) {
      await prisma.customer.update({
        where: { id: data.customerId },
        data: { totalRepairs: { increment: 1 } },
      }).catch(() => {});
    }

    return NextResponse.json(repair, { status: 201 });
  } catch (error) {
    console.error('Create repair error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
