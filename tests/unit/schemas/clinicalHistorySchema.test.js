import { describe, it, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import ClinicalHistory from '../../../src/models/ClinicalHistory.js';

// Schema validation tests
describe('CLINICAL HISTORY SCHEMA TESTS', () => {
  it('should create a valid clinical history with all fields', async () => {
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
        { name: 'X-ray', url: 'http://example.com/xray.jpg', date: new Date() }
      ],
      analitycs: [
        { name: 'Blood Test', url: 'http://example.com/bloodtest.pdf', date: new Date() }
      ],
      allergies: ['Peanuts', 'Dust']
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).resolves.not.toThrow();
  });

  it('should throw validation error for invalid UUID in patientId', async () => {
    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: 'invalid-uuid',
      currentConditions: [],
      treatments: [],
      images: [],
      analitycs: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('Invalid patient UUID');
  });

  it('should throw validation error for missing required fields in currentCondition', async () => {
    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      currentConditions: [
        { details: 'High blood pressure', since: new Date() } // Missing 'name'
      ],
      treatments: [],
      images: [],
      analitycs: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow();
  });

  it('should throw validation error for invalid URL in images', async () => {
    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      currentConditions: [],
      treatments: [],
      images: [
        { name: 'X-ray', url: 'invalid-url', date: new Date() }
      ],
      analitycs: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('Invalid URL');
  });

  it('should throw validation error for missing required fields in treatment', async () => {
    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      currentConditions: [],
      treatments: [
        { startDate: new Date(), endDate: new Date(), instructions: 'Take once daily' } // Missing 'name'
      ],
      images: [],
      analitycs: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow();
  });

  it('should throw validation error if startDate is after endDate', async () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day later
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day before

    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      treatments: [
        { name: 'Invalid Treatment', startDate: futureDate, endDate: pastDate, instructions: 'Take once daily' }
      ],
      currentConditions: [],
      images: [],
      analitycs: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('End date must be today or in the future');
  });

  it('should throw validation error if startDate is before today', async () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day before

    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      treatments: [
        { name: 'Invalid Treatment', startDate: pastDate, endDate: now, instructions: 'Take once daily' }
      ],
      currentConditions: [],
      images: [],
      analitycs: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('Start date must be today or in the future');
  });

  it('should throw validation error if endDate is before today', async () => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day before

    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      treatments: [
        { name: 'Invalid Treatment', startDate: now, endDate: pastDate, instructions: 'Take once daily' }
      ],
      currentConditions: [],
      images: [],
      analitycs: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('End date must be today or in the future');
  });

});
