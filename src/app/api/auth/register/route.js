import { dbConnect } from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  const body = await request.json();
  const { email, password } = body;

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
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
