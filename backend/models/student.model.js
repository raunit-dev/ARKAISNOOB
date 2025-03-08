import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  badge_token_id: { type: Number, required: true },
  metadata_uri: { type: String, required: true },
  achievement: { type: String, required: true }
});

const certificateSchema = new mongoose.Schema({
  token_id: { type: Number, required: true },
  name: { type: String, required: true },
  degree: { type: String, required: true },
  completion_date: { type: Date, required: true },
  metadata_uri: { type: String, required: true }
});

const studentSchema = new mongoose.Schema({

  metamask_wallet_id: { type: String },
  certificates: [certificateSchema],
  course_progress: {
    type: Map,
    of: Number,
    default: {
      "Data structures": 0,
      "Deep learning": 0,
      "Blockchain": 0
    },
  },
  quiz_scores: {
    type: Map,
    of: [Number],
    default: {
      "Data structures": [],
      "Deep learning": [],
      "Blockchain": []
    },
  },
  grades: {
    type: Map,
    of: String,
    default: {
      "Data structures": "",
      "Deep learning": "",
      "Blockchain": ""
    },
  },
  projects: {
    type: Map,
    of: String,
    default: {
      "Data structures": "Not Started",
      "Deep learning": "Not Started",
      "Blockchain": "Not Started"
    }
  }
}, {timestamps: true});

const Student = mongoose.model('Student', studentSchema);

export { Student }
