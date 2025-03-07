import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  badge_token_id: { type: Number, required: true },
  metadata_uri: { type: String, required: true }
});

const studentSchema = new mongoose.Schema({
  portfolio_token_id: { type: Number, default: null },
  badges: [badgeSchema],
  created_at: { type: Date, default: Date.now }
});

export const Student = mongoose.model('Student', studentSchema);