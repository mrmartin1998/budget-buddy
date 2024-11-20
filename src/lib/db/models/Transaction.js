import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  account: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }
  }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
