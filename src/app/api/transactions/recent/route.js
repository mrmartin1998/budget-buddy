import { dbConnect } from '@/lib/db/connect';
import Transaction from '@/lib/db/models/Transaction';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

  try {
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5);
    
    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}