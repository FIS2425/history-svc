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

const removeAllClinicalHistories = async () => {
  try {
    await ClinicalHistory.deleteMany({});
    console.log('All clinical histories have been removed');
  } catch (error) {
    console.error('Error removing clinical histories:', error);
  }
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
        name: 'blood-pressure-chart'+uuidv4()+'.png',
        originalName: 'blood-pressure-chart.png',
        url: 'https://www.example.com/blood-pressure-chart.png',
      }
    ],
    analytics: [
      {
        date: '2021-01-01',
        name: 'blood-pressure'+uuidv4()+'.csv',
        originalName: 'blood-pressure.csv',
        url: 'https://www.example.com/blood-pressure.csv',
      }
    ],
    allergies: ['Penicillin'],
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    currentConditions: [
      {
        name: 'Asthma',
        details: 'Exercise-induced asthma',
        since: '2019-01-01',
      }
    ],
    treatments: [ 
      {
        name: 'Albuterol inhaler 90mcg',
        instructions: 'Use as needed for shortness of breath',
        startDate: '2019-01-01',
        endDate: '2021-01-01',
      }
    ],
    images: [
      {
        date: '2021-01-01',
        name: 'pulmonary-function-test'+uuidv4()+'.png',
        originalName: 'pulmonary-function-test.png',
        url: 'https://www.example.com/pulmonary-function-test.png',
      }
    ],
    analytics: [
      {
        date: '2021-01-01',
        name: 'pulmonary-function'+uuidv4()+'.csv',
        originalName: 'pulmonary-function.csv',
        url: 'https://www.example.com/pulmonary-function.csv',
      }
    ],
    allergies: ['Peanuts'],
  },
  {
    _id: uuidv4(),
    patientId: uuidv4(),
    currentConditions: [
      {
        name: 'Depression',
        details: 'Major depressive disorder',
        since: '2020-01-01',
      }
    ],
    treatments: [ 
      {
        name: 'Sertraline 50mg',
        instructions: 'Take 1 tablet daily',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
      }
    ],
    images: [
      {
        date: '2021-01-01',
        name: 'phq-9'+uuidv4()+'.png',
        originalName: 'phq-9.png',
        url: 'https://www.example.com/phq-9.png',
      }
    ],
    analytics: [
      {
        date: '2021-01-01',
        name: 'phq-9'+uuidv4()+'.csv',
        originalName: 'phq-9.csv',
        url: 'https://www.example.com/phq-9.csv',
      }
    ],
    allergies: [],
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
  await removeAllClinicalHistories();
  await populateClinicalHistories();
})();
