import { dbConnect } from '@/lib/db/connect';
import Category from '@/lib/db/models/Category';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants/categories';

async function seedDefaultCategories(userId) {
  const defaultCategories = [
    ...EXPENSE_CATEGORIES.map(name => ({
      userId,
      name,
      type: 'expense',
      isCustom: false,
      color: '#4B5563',
    })),
    ...INCOME_CATEGORIES.map(name => ({
      userId,
      name,
      type: 'income',
      isCustom: false,
      color: '#10B981',
    }))
  ];

  await Category.insertMany(defaultCategories);
}

export async function GET() {
  await dbConnect();
  
  const headersList = headers();
  const authorization = headersList.get('authorization');

  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    let categories = await Category.find({ userId });

    if (categories.length === 0) {
      await seedDefaultCategories(userId);
      categories = await Category.find({ userId });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  
  const headersList = headers();
  const authorization = headersList.get('authorization');

  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    const body = await request.json();
    const { name, type, color } = body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      userId, 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    // Create new custom category
    const category = await Category.create({
      userId,
      name,
      type,
      color,
      isCustom: true
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 