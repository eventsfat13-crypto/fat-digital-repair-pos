import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        repairs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            model: true,
            brand: true,
            primaryTechnician: true,
          },
        },
        paymentHistory: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { repairs: true } },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
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

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        mobile: data.mobile,
        whatsapp: data.whatsapp,
        email: data.email,
        cnic: data.cnic,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        notes: data.notes,
        photo: data.photo,
        signature: data.signature,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Update customer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete customer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
