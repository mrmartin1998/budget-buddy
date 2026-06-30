// src/app/api/accounts/[id]/route.js
import { dbConnect } from '@/lib/db/connect';
import Account from '@/lib/db/models/Account';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { accountSchema } from '@/lib/validation/schemas';
import { validateRequestBody, validateObjectId } from '@/lib/validation/middleware';

export async function DELETE(request, { params }) {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

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
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

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