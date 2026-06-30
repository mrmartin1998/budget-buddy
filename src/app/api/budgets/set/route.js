import { dbConnect } from '@/lib/db/connect';
import Budget from '@/lib/db/models/Budget';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { budgetSchema } from '@/lib/validation/schemas';
import { validateRequestBody } from '@/lib/validation/middleware';

export async function POST(request) {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

  try {
    const body = await request.json();
    
    const validation = validateRequestBody(body, budgetSchema);
    if (!validation.success) {
      return validation.error;
    }

    const budget = await Budget.create({
      ...validation.data,
      userId
    });

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}