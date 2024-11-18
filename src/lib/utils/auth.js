import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
    { expiresIn: '24h' }
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
