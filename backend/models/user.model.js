import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  wallet_address: { type: String, unique: true, required: true, default:"b621797b06ff9dade33da7cedd28383b1dde7e7ca99318b2122c77254a9dda4c"},
  role: { type: mongoose.Schema.Types.ObjectId, refPath: 'roleModel', required: true },
  roleModel: { type: String, enum: ['Student', 'College'], required: true }
});

const User = mongoose.model('User', userSchema);

export {User}
