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
    const result = await Transaction.aggregate([
      {
        $match: {
          userId: userId
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          _id: 0
        }
      }
    ]);

    return NextResponse.json({
      categories: result.map(item => ({
        category: item.category,
        total: Math.abs(item.total)
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}