import { dbConnect } from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation/schemas';
import { validateRequestBody } from '@/lib/validation/middleware';
import { authRateLimit } from '@/middleware/rateLimit';

export async function POST(request) {
  // Rate limiting check - 5 attempts per 15 minutes
  const rateLimitResult = authRateLimit(request);
  if (!rateLimitResult.success) {
    return rateLimitResult.error;
  }

  await dbConnect();

  const body = await request.json();
  
  const validation = validateRequestBody(body, registerSchema);
  if (!validation.success) {
    return validation.error;
  }
  
  const { email, password } = validation.data;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user - let the User model handle password hashing
    const newUser = new User({ email, password });
    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
