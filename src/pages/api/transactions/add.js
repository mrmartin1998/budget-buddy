import { dbConnect } from '../dbConnect';
import Transaction from '../models/Transaction';
import { verifyToken } from '../auth/verifyToken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  const { amount, type, category, date } = req.body;

  if (!amount || !type || !category) {
    return res.status(400).json({ error: 'Amount, type, and category are required' });
  }

  try {
    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      category,
      date,
    });
    await newTransaction.save();

    res.status(201).json({ message: 'Transaction added successfully', transaction: newTransaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
