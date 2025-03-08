import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
});

const College = mongoose.model('College', collegeSchema);

export { College };