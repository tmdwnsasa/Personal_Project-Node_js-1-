import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema(
  {
    character_ID: {
      type: Number,
      required: true,
      unique: true,
    },
    equipment: {
      type: Array,
    },
  },
  { versionKey: false },
);

export default mongoose.model('Equipment', EquipmentSchema);
