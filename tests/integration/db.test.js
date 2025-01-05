import mongoose from 'mongoose';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import ClinicalHistory from '../../src/models/ClinicalHistory';

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.VITE_MONGOURL);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Clinical history model', () => {
  it('should create, get, and delete a clinical history with valid data', async () => {
    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      currentConditions: [
        { name: 'Hypertension', details: 'High blood pressure', since: new Date() }
      ],
      treatments: [
        { name: 'Blood Pressure Medication', startDate: new Date(), endDate: new Date(), instructions: 'Take once daily' }
      ],
      images: [
        { name: 'X-ray', url: 'http://example.com/xray.jpg', date: new Date(), originalName: 'xray.jpg' }
      ],
      analytics: [
        { name: 'Blood Test', url: 'http://example.com/bloodtest.pdf', date: new Date(), originalName: 'bloodtest.pdf' }
      ],
      allergies: ['Peanuts', 'Dust']
    };
  
    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    const savedClinicalHistory = await clinicalHistory.save();
  
    expect(savedClinicalHistory).toBeDefined();
    expect(savedClinicalHistory._id).toBe(clinicalHistoryData._id);
    expect(savedClinicalHistory.patientId).toBe(clinicalHistoryData.patientId);
    expect(savedClinicalHistory.currentConditions[0].name).toBe(clinicalHistoryData.currentConditions[0].name);
    expect(savedClinicalHistory.currentConditions[0].details).toBe(clinicalHistoryData.currentConditions[0].details);
    expect(savedClinicalHistory.currentConditions[0].since).toStrictEqual(clinicalHistoryData.currentConditions[0].since);
    expect(savedClinicalHistory.treatments[0].name).toBe(clinicalHistoryData.treatments[0].name);
    expect(savedClinicalHistory.treatments[0].startDate).toStrictEqual(clinicalHistoryData.treatments[0].startDate);
    expect(savedClinicalHistory.treatments[0].endDate).toStrictEqual(clinicalHistoryData.treatments[0].endDate);
    expect(savedClinicalHistory.treatments[0].instructions).toBe(clinicalHistoryData.treatments[0].instructions);
    expect(savedClinicalHistory.images[0].name).toBe(clinicalHistoryData.images[0].name);
    expect(savedClinicalHistory.images[0].url).toBe(clinicalHistoryData.images[0].url);
    expect(savedClinicalHistory.images[0].date).toStrictEqual(clinicalHistoryData.images[0].date);
    expect(savedClinicalHistory.images[0].originalName).toBe(clinicalHistoryData.images[0].originalName);
    expect(savedClinicalHistory.analytics[0].name).toBe(clinicalHistoryData.analytics[0].name);
    expect(savedClinicalHistory.analytics[0].url).toBe(clinicalHistoryData.analytics[0].url);
    expect(savedClinicalHistory.analytics[0].date).toStrictEqual(clinicalHistoryData.analytics[0].date);
    expect(savedClinicalHistory.analytics[0].originalName).toBe(clinicalHistoryData.analytics[0].originalName);
    expect(savedClinicalHistory.allergies).toEqual(clinicalHistoryData.allergies);

    // Get the clinical history
    const foundClinicalHistory = await ClinicalHistory.findById(savedClinicalHistory._id);
    expect(foundClinicalHistory).toBeDefined();
    expect(foundClinicalHistory._id).toBe(clinicalHistoryData._id);
    expect(foundClinicalHistory.patientId).toBe(clinicalHistoryData.patientId);
    expect(foundClinicalHistory.currentConditions[0].name).toBe(clinicalHistoryData.currentConditions[0].name);
    expect(foundClinicalHistory.currentConditions[0].details).toBe(clinicalHistoryData.currentConditions[0].details);
    expect(foundClinicalHistory.currentConditions[0].since).toStrictEqual(clinicalHistoryData.currentConditions[0].since);
    expect(foundClinicalHistory.treatments[0].name).toBe(clinicalHistoryData.treatments[0].name);
    expect(foundClinicalHistory.treatments[0].startDate).toStrictEqual(clinicalHistoryData.treatments[0].startDate);
    expect(foundClinicalHistory.treatments[0].endDate).toStrictEqual(clinicalHistoryData.treatments[0].endDate);
    expect(foundClinicalHistory.treatments[0].instructions).toBe(clinicalHistoryData.treatments[0].instructions);
    expect(foundClinicalHistory.images[0].name).toBe(clinicalHistoryData.images[0].name);
    expect(foundClinicalHistory.images[0].url).toBe(clinicalHistoryData.images[0].url);
    expect(foundClinicalHistory.images[0].date).toStrictEqual(clinicalHistoryData.images[0].date);
    expect(foundClinicalHistory.images[0].originalName).toBe(clinicalHistoryData.images[0].originalName);
    expect(foundClinicalHistory.analytics[0].name).toBe(clinicalHistoryData.analytics[0].name);
    expect(foundClinicalHistory.analytics[0].url).toBe(clinicalHistoryData.analytics[0].url);
    expect(foundClinicalHistory.analytics[0].date).toStrictEqual(clinicalHistoryData.analytics[0].date);
    expect(foundClinicalHistory.analytics[0].originalName).toBe(clinicalHistoryData.analytics[0].originalName);
    expect(foundClinicalHistory.allergies).toEqual(clinicalHistoryData.allergies);

    // Delete the doctor
    await ClinicalHistory.findByIdAndDelete(savedClinicalHistory._id);
    const deletedClinicalHistory = await ClinicalHistory.findById(savedClinicalHistory._id);
    expect(deletedClinicalHistory).toBeNull();
  });
});