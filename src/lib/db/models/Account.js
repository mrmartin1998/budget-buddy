import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, default: 0 },
  totalIncome: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 }
}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Add a method to update balance
AccountSchema.methods.updateBalance = function(amount, type) {
  this.balance = type === 'income' 
    ? this.balance + amount 
    : this.balance - amount;
  return this.balance;
};

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);