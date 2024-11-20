import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  totalIncome: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);