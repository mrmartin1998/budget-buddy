import { dbConnect } from '@/lib/db/connect';
import Budget from '@/lib/db/models/Budget';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

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

  const body = await request.json();
  const { category, limit } = body;

  try {
    // Update existing budget or create new one
    const budget = await Budget.findOneAndUpdate(
      { userId, category },
      { limit },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      { message: 'Budget set successfully', budget },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting budget:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}