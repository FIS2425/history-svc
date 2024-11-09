import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import ClinicalHistory from '../src/models/ClinicalHistory.js'; 

const MONGO_URI = process.env.MONGOURL;

const connectToDatabase = async () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
    });
};


const sampleClinicalHistories = [
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    currentConditions: [
      {
        name: 'Hypertension',
        details: 'High blood pressure',
        since: '2018-01-01',
      }, 
      {
        name: 'Diabetes',
        details: 'Type 2 diabetes',
        since: '2019-01-01',
      }
    ],
    treatments: [ 
      {
        name: 'Lisinopril 5mg',
        instructions: 'Take 1 tablet daily',
        startDate: '2018-01-01',
        endDate: '2020-01-01',
      } 
    ],
    images: [
      {
        date: '2021-01-01',
        name: 'Blood pressure chart',
        url: 'https://www.example.com/blood-pressure-chart.png',
      }
    ],
    analytics: [
      {
        date: '2021-01-01',
        name: 'Blood pressure',
        url: 'https://www.example.com/blood-pressure.csv',
      }
    ],
    allergies: ['Penicillin'],
  }
];

async function populateClinicalHistories() {
  try {
    for (const apptData of sampleClinicalHistories) {
      const history = new ClinicalHistory(apptData);
      await history.save();
      console.log('Clinical history created successfully');
    }

    console.log('All sample clinical histories have been created');
  } catch (error) {
    console.error('Error populating clinical histories:', error);
  } finally {
    mongoose.disconnect();
  }
}

(async () => {
  await connectToDatabase();
  await populateClinicalHistories();
})();
