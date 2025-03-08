import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  wallet_address: { type: String, unique: true, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, refPath: 'roleModel', required: true },
  roleModel: { type: String, enum: ['Student', 'College'], required: true }
});

const User = mongoose.model('User', userSchema);

export {User}
