import { dbConnect } from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/utils/auth';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email with password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({ 
      success: true,
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        email: user.email
      }
    }, { status: 200 });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
