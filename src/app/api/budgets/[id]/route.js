import { dbConnect } from '@/lib/db/connect';
import Budget from '@/lib/db/models/Budget';
import { getUserIdFromCookies } from '@/lib/utils/auth';
import { NextResponse } from 'next/server';
import { budgetSchema } from '@/lib/validation/schemas';
import { validateRequestBody, validateObjectId } from '@/lib/validation/middleware';

export async function PUT(request, { params }) {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

  try {
    const budgetId = params.id;
    const body = await request.json();
    
    const idValidation = validateObjectId(budgetId, 'budgetId');
    if (!idValidation.success) {
      return idValidation.error;
    }
    
    const validation = validateRequestBody(body, budgetSchema.partial());
    if (!validation.success) {
      return validation.error;
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, userId },
      { $set: validation.data },
      { new: true }
    );
    
    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  
  const { userId, error } = getUserIdFromCookies();
  if (error) return error;

  try {
    const budgetId = params.id;
    
    const idValidation = validateObjectId(budgetId, 'budgetId');
    if (!idValidation.success) {
      return idValidation.error;
    }

    const budget = await Budget.findOneAndDelete({ _id: budgetId, userId });
    
    if (!budget) {
      return NextResponse.json(
        { error: 'Budget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
} 