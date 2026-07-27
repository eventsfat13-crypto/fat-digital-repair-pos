import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('categoryId');
    const lowStock = searchParams.get('lowStock');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
        { barcode: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (lowStock === 'true') {
      where.quantity = { lte: prisma.inventoryProduct.fields.lowStockAlert };
    }

    const [products, total] = await Promise.all([
      prisma.inventoryProduct.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          category: true,
          supplier: true,
        },
      }),
      prisma.inventoryProduct.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Inventory error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const product = await prisma.inventoryProduct.create({
      data: {
        sku: data.sku || `SKU-${Date.now()}`,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        supplierId: data.supplierId,
        costPrice: data.costPrice || 0,
        sellingPrice: data.sellingPrice || 0,
        quantity: data.quantity || 0,
        lowStockAlert: data.lowStockAlert || 5,
        serialNumber: data.serialNumber,
        warranty: data.warranty,
        barcode: data.barcode,
      },
    });

    if (data.quantity > 0) {
      await prisma.stockHistory.create({
        data: {
          productId: product.id,
          type: 'STOCK_IN',
          quantity: data.quantity,
          reason: 'Initial stock',
        },
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
