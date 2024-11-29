import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  color: { type: String, default: '#4B5563' },
  icon: { type: String },
  isCustom: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index to ensure unique categories per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);