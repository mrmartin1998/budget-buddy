// src/app/api/accounts/[id]/route.js
import { dbConnect } from '@/lib/db/connect';
import Account from '@/lib/db/models/Account';
import { verifyToken } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { accountSchema } from '@/lib/validation/schemas';
import { validateRequestBody, validateObjectId } from '@/lib/validation/middleware';

export async function DELETE(request, { params }) {
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
    const accountId = params.id;
    
    const idValidation = validateObjectId(accountId, 'accountId');
    if (!idValidation.success) {
      return idValidation.error;
    }

    // Find the account and verify ownership
    const account = await Account.findOne({ 
      _id: accountId,
      userId 
    });
    
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Delete the account
    await Account.findByIdAndDelete(accountId);
    
    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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
    const accountId = params.id;
    const body = await request.json();
    
    const idValidation = validateObjectId(accountId, 'accountId');
    if (!idValidation.success) {
      return idValidation.error;
    }
    
    const validation = validateRequestBody(body, accountSchema.partial());
    if (!validation.success) {
      return validation.error;
    }

    const account = await Account.findOneAndUpdate(
      { _id: accountId, userId },
      { $set: validation.data },
      { new: true, runValidators: true }
    );
    
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}