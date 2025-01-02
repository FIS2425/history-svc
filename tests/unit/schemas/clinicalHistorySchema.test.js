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
        { name: 'X-ray', url: 'http://example.com/xray.jpg', date: new Date(), originalName: 'xray.jpg' }
      ],
      analytics: [
        { name: 'Blood Test', url: 'http://example.com/bloodtest.pdf', date: new Date(), originalName: 'bloodtest.pdf' }
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
      analytics: [],
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
      analytics: [],
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
        { name: 'X-ray', url: 'invalid-url', date: new Date(), originalName: 'xray.jpg' }
      ],
      analytics: [],
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
      analytics: [],
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
      analytics: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('End date must be greater than or equal to start date');
  });

  it('should throw validation error for currentCondition with date in the future', async () => {
    const futureDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 1 day later

    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      currentConditions: [
        { name: 'Hypertension', details: 'High blood pressure', since: futureDate }
      ],
      treatments: [],
      images: [],
      analytics: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('Since must be today or in the past');
  });

  it('should throw validation error if until date is earlier than since date', async () => {
    const sinceDate = new Date(); // Fecha actual
    const earlierUntilDate = new Date(sinceDate.getTime() - 24 * 60 * 60 * 1000); // 1 día antes

    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      currentConditions: [
        { name: 'Diabetes', details: 'Type 2 Diabetes', since: sinceDate, until: earlierUntilDate }
      ],
      treatments: [],
      images: [],
      analytics: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('Since must be less than or equal to Until');
  });

  it('should throw validation error for currentCondition with until date in the future', async () => {
    const sinceDate = new Date();
    const futureUntilDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 1 day later

    const clinicalHistoryData = {
      _id: uuidv4(),
      patientId: uuidv4(),
      currentConditions: [
        { name: 'Diabetes', details: 'Type 2 Diabetes', since: sinceDate, until: futureUntilDate }
      ],
      treatments: [],
      images: [],
      analytics: [],
      allergies: []
    };

    const clinicalHistory = new ClinicalHistory(clinicalHistoryData);
    await expect(clinicalHistory.validate()).rejects.toThrow('Until must be today or in the past');
  });

});
