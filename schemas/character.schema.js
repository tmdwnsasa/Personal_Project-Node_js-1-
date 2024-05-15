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

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Character', CharacterSchema);
