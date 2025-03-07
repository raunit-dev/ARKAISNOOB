import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  college_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export const College = mongoose.model('College', collegeSchema);