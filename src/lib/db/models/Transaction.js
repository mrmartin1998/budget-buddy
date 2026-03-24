import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true });

// Database indexes for query optimization
// These dramatically improve query performance (10-1000x faster)
TransactionSchema.index({ userId: 1, date: -1 }); // User's transactions by date (most common query)
TransactionSchema.index({ accountId: 1, date: -1 }); // Account transactions by date
TransactionSchema.index({ userId: 1, category: 1 }); // Category filtering and reports
TransactionSchema.index({ userId: 1, type: 1, date: -1 }); // Income/expense filtering

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
