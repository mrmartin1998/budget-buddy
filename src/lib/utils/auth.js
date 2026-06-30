import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export function generateToken(user) {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromCookies() {
  const cookieStore = cookies();
  return cookieStore.get('token')?.value;
}

export function getUserFromToken(token) {
  if (!token) return null;
  return verifyToken(token);
}

export async function isAuthenticated() {
  const token = getTokenFromCookies();
  if (!token) return false;
  
  const user = getUserFromToken(token);
  return !!user;
}

/**
 * Extract userId from the token stored in httpOnly cookies
 * Returns { userId, error } where error is a NextResponse if authentication fails
 */
export function getUserIdFromCookies() {
  const token = getTokenFromCookies();
  
  if (!token) {
    return {
      userId: null,
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    };
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return {
        userId: null,
        error: NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      };
    }
    
    return { userId: decoded.userId, error: null };
  } catch (error) {
    return {
      userId: null,
      error: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    };
  }
}
