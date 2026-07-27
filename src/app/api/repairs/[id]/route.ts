import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const repair = await prisma.repair.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        model: true,
        customer: true,
        primaryTechnician: true,
        services: { include: { service: true } },
        inspection: { include: { item: true } },
        parts: { include: { product: true } },
        images: { orderBy: { createdAt: 'desc' } },
        assignments: {
          include: {
            technician: true,
            user: { select: { displayName: true, username: true } },
          },
        },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        invoice: true,
      },
    });

    if (!repair) {
      return NextResponse.json({ error: 'Repair not found' }, { status: 404 });
    }

    return NextResponse.json(repair);
  } catch (error) {
    console.error('Get repair error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existing = await prisma.repair.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Repair not found' }, { status: 404 });
    }

    if (data.status && data.status !== existing.status) {
      await prisma.statusHistory.create({
        data: {
          repairId: id,
          status: data.status,
          notes: data.statusNotes || `Status changed to ${data.status}`,
          changedBy: data.changedBy,
        },
      });

      if (data.status === 'COMPLETED' || data.status === 'DELIVERED') {
        data.completedAt = new Date().toISOString();
      }
    }

    const repair = await prisma.repair.update({
      where: { id },
      data: {
        status: data.status,
        priority: data.priority,
        isDraft: data.isDraft,
        step: data.step,
        categoryId: data.categoryId,
        brandId: data.brandId,
        modelId: data.modelId,
        deviceInfo: data.deviceInfo,
        customerId: data.customerId,
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        customerEmail: data.customerEmail,
        estimatedTime: data.estimatedTime,
        estimatedDuration: data.estimatedDuration,
        expectedDeliveryAt: data.expectedDeliveryAt ? new Date(data.expectedDeliveryAt) : undefined,
        countdownStartedAt: data.countdownStartedAt ? new Date(data.countdownStartedAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        labourCost: data.labourCost,
        partsCost: data.partsCost,
        tax: data.tax,
        discount: data.discount,
        advancePayment: data.advancePayment,
        grandTotal: data.grandTotal,
        remainingBalance: data.remainingBalance,
        primaryTechnicianId: data.primaryTechnicianId,
        complaint: data.complaint,
        repairNotes: data.repairNotes,
        technicianNotes: data.technicianNotes,
        cancellationReason: data.cancellationReason,
      },
      include: {
        category: true,
        brand: true,
        model: true,
        customer: true,
        primaryTechnician: true,
        services: { include: { service: true } },
        inspection: { include: { item: true } },
        parts: { include: { product: true } },
        images: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    return NextResponse.json(repair);
  } catch (error) {
    console.error('Update repair error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.repair.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete repair error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
