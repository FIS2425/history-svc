import { Schema } from 'mongoose';

const currentConditionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  since: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default currentConditionSchema;
