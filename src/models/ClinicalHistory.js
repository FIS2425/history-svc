import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Schema, model } from 'mongoose';
import currentConditionSchema from './CurrentCondition.js';
import fileSchema from './File.js';
import treatmentSchema from './Treatment.js';

const clinicalHistorySchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
    validate: {
      validator: (value) => uuidValidate(value),
      message: 'Invalid UUID',
    },
  },
  patientId: {
    type: String,
    required: true,
    validate: {
      validator: (value) => uuidValidate(value),
      message: 'Invalid patient UUID',
    },
  },
  currentConditions: {
    type: [currentConditionSchema],
    required: true,
    default: [],
  },
  treatments: {
    type: [treatmentSchema],
    required: true,
    default: [],
  },
  images: {
    type: [fileSchema],
    required: true,
    default: [],
  },
  analitycs: {
    type: [fileSchema],
    required: true,
    default: [],
  },
  allergies: {
    type: [String],
    required: true,
    default: [],
  },
});

export default model('ClinicalHistory', clinicalHistorySchema);
