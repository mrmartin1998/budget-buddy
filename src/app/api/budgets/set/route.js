import { dbConnect } from '@/lib/db/connect';
import Budget from '@/lib/db/models/Budget';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { budgetSchema } from '@/lib/validation/schemas';
import { validateRequestBody } from '@/lib/validation/middleware';

export async function POST(request) {
  await dbConnect();
  
  const headersList = headers();
  const authorization = headersList.get('authorization');

  if (!authorization) {
    return NextResponse.json(
      { error: 'Authorization header missing' },
      { status: 401 }
    );
  }

  const token = authorization.split(' ')[1];
  let userId;
  
  try {
    const decoded = verifyToken(token);
    userId = decoded.userId;
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

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