import { Schema } from 'mongoose';

const fileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  }
});

export default fileSchema;