import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalRepairs,
      activeRepairs,
      pendingRepairs,
      completedRepairs,
      deliveredRepairs,
      todayRepairs,
      totalCustomers,
      totalTechnicians,
      dailySales,
      weeklySales,
      monthlySales,
      yearlySales,
      lowStockItems,
      recentRepairs,
    ] = await Promise.all([
      prisma.repair.count({ where: { isDraft: false } }),
      prisma.repair.count({ where: { status: { in: ['IN_PROGRESS', 'DIAGNOSING', 'TESTING', 'QUALITY_CHECK'] } } }),
      prisma.repair.count({ where: { status: 'PENDING' } }),
      prisma.repair.count({ where: { status: 'COMPLETED' } }),
      prisma.repair.count({ where: { status: 'DELIVERED' } }),
      prisma.repair.count({ where: { isDraft: false, createdAt: { gte: startOfDay } } }),
      prisma.customer.count(),
      prisma.technician.count({ where: { isActive: true } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: startOfDay } } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: startOfWeek } } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: startOfMonth } } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: startOfYear } } }),
      prisma.inventoryProduct.count({ where: { quantity: { lte: prisma.inventoryProduct.fields.lowStockAlert } } }),
      prisma.repair.findMany({
        where: { isDraft: false },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          customer: { select: { name: true, customerId: true } },
          primaryTechnician: { select: { name: true } },
          model: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalRepairs,
      activeRepairs,
      pendingRepairs,
      completedRepairs,
      deliveredRepairs,
      todayRepairs,
      dailySales: dailySales._sum.amount || 0,
      weeklySales: weeklySales._sum.amount || 0,
      monthlySales: monthlySales._sum.amount || 0,
      yearlySales: yearlySales._sum.amount || 0,
      lowStockItems,
      totalCustomers,
      totalTechnicians,
      recentRepairs,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
