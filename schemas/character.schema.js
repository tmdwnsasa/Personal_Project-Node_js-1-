import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema(
  {
    character_ID: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    health: {
      type: Number,
      required: true,
    },
    power: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false },
);

export default mongoose.model('Character', CharacterSchema);
