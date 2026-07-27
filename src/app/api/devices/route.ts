import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all categories with brands and model count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const brandId = searchParams.get('brandId');
    const categoryId = searchParams.get('categoryId');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    if (type === 'categories') {
      const where: any = {};
      if (!includeInactive) where.isActive = true;
      const categories = await prisma.deviceCategory.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { brands: true } } },
      });
      return NextResponse.json(categories);
    }

    if (type === 'brands') {
      const where: any = {};
      if (!includeInactive) where.isActive = true;
      if (categoryId) where.categoryId = categoryId;
      const brands = await prisma.deviceBrand.findMany({
        where,
        orderBy: { name: 'asc' },
        include: { _count: { select: { models: true } }, category: true },
      });
      return NextResponse.json(brands);
    }

    if (type === 'models') {
      const where: any = {};
      if (!includeInactive) where.isActive = true;
      if (brandId) where.brandId = brandId;
      const models = await prisma.deviceModel.findMany({
        where,
        orderBy: { name: 'asc' },
        include: { brand: { include: { category: true } } },
        take: 500,
      });
      return NextResponse.json(models);
    }

    return NextResponse.json({ error: 'Specify type: categories, brands, or models' }, { status: 400 });
  } catch (error) {
    console.error('Devices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');

    if (entity === 'category') {
      const category = await prisma.deviceCategory.create({
        data: {
          name: data.name,
          icon: data.icon,
          sortOrder: data.sortOrder || 0,
        },
      });
      return NextResponse.json(category, { status: 201 });
    }

    if (entity === 'brand') {
      const brand = await prisma.deviceBrand.create({
        data: {
          name: data.name,
          categoryId: data.categoryId,
          logo: data.logo,
        },
      });
      return NextResponse.json(brand, { status: 201 });
    }

    if (entity === 'model') {
      const model = await prisma.deviceModel.create({
        data: {
          name: data.name,
          series: data.series,
          year: data.year,
          brandId: data.brandId,
        },
      });
      return NextResponse.json(model, { status: 201 });
    }

    return NextResponse.json({ error: 'Specify entity type' }, { status: 400 });
  } catch (error) {
    console.error('Create device error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
