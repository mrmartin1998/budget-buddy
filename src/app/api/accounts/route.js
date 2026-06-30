import { dbConnect } from '@/lib/db/connect';
import Account from '@/lib/db/models/Account';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

  try {
    const accounts = await Account.find({ userId });
    return NextResponse.json({ accounts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}