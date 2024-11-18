import { dbConnect } from '../dbConnect';
import Transaction from '../models/Transaction';
import { verifyToken } from '../auth/verifyToken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authorization.split(' ')[1];
  let userId;
  try {
    const decoded = verifyToken(token);
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const transactions = await Transaction.find({ userId });
    return res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
