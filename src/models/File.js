import { Schema } from 'mongoose';
import validator from 'validator';

const fileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Invalid URL'
    }
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  }
});

export default fileSchema;