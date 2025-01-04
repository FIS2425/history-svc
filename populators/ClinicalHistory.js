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
    _id: 'f78ad724-049c-4a0f-8687-4ba16267dc60',
    patientId: 'f8b8d3e7-4bb7-4d1b-99a4-e3a8f0452f63',
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
    _id: '6250c947-f29e-4e73-ae2f-cf6042aeb067',
    patientId: 'a2c7f9d1-5b3a-42d8-8e5f-7c4b9f1e8a92',
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
    _id: '3078e2df-69f8-4bd7-9d13-1777eb91c1bf',
    patientId: 'd4f8b1a9-3e7c-45d2-9c6a-2b9f7e4a8c53',
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
  },
  {
    _id: 'af1ac113-8bce-4c95-bfde-fb049ef35530',
    patientId: 'b1a7f9e3-6c5d-49d2-8f4a-3b7e9f5a6c71',
    currentConditions: [
      {
        name: 'Anxiety',
        details: 'Generalized anxiety disorder',
        since: '2020-01-01',
      }
    ],
    treatments: [ 
      {
        name: 'Buspirone 10mg',
        instructions: 'Take 1 tablet twice daily',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
      }
    ],
    images: [
      {
        date: '2021-01-01',
        name: 'gad-7'+uuidv4()+'.png',
        originalName: 'gad-7.png',
        url: 'https://www.example.com/gad-7.png',
      }
    ],
    analytics: [
      {
        date: '2021-01-01',
        name: 'gad-7'+uuidv4()+'.csv',
        originalName: 'gad-7.csv',
        url: 'https://www.example.com/gad-7.csv',
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
