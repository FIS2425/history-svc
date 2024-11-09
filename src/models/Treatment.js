import { Schema } from 'mongoose';

const treatmentSchema = new Schema({ 
  name: { 
    type: String, 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  instructions: { 
    type: String, 
    required: true 
  },
});

export default treatmentSchema;