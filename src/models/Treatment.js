import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: () => {
      const today = new Date();
      const utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      return utc;
    },
    validate: {
      validator: function(value) {
        // Verify that startDate is not in the past
        const today = new Date();
        const utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        return value >= utc;
      },
      message: 'Start date must be today or in the future'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: [
      {
        validator: function(value) {
          // Verify that endDate is not in the past
          const today = new Date();
          const utc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
          return value >= utc;
        },
        message: 'End date must be today or in the future'
      },
      {
        validator: function(value) {
          // Verify that endDate is greater than or equal to startDate
          return !this.startDate || value >= this.startDate;
        },
        message: 'End date must be greater than or equal to start date'
      }
    ]
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required']
  }
});

export default treatmentSchema;