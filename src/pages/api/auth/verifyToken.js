import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment');
  }

  return jwt.verify(token, process.env.JWT_SECRET);
}
