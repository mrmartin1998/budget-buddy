import { dbConnect } from '../../dbConnect';
import Transaction from '../../models/Transaction';
import { verifyToken } from '../../auth/verifyToken';
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
  const { amount, type, category, date } = body;

  if (!amount || !type || !category) {
    return NextResponse.json(
      { error: 'Amount, type, and category are required' },
      { status: 400 }
    );
  }

  try {
    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      category,
      date,
    });
    await newTransaction.save();

    return NextResponse.json(
      { message: 'Transaction added successfully', transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
