import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    item_code: {
      type: Number,
      required: true,
      unique: true,
    },
    item_name: {
      type: String,
      required: true,
      unique: true,
    },
    item_stat: {
      health: {
        type: Number,
      },
      power: {
        type: Number,
      },
    },
  },
  { versionKey: false },
);

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Item', ItemSchema);
