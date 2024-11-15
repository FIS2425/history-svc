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
    default: () => {
      const today = new Date();
      const utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      return utc;
    },
    validate: {
      validator: function (value) {
        // Verify that since is not in the future
        const today = new Date();
        const utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59));
        return value <= utc;
      },
      message: 'Since must be today or in the past',
    },
  },
});

export default currentConditionSchema;
