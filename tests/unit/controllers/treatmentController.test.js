import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import ClinicalHistory from '../../../src/models/ClinicalHistory.js';
import * as db from '../../setup/database';
import { request } from '../../setup/setup';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

beforeAll(async () => {
  await db.clearDatabase();
  // Insert mock data if necessary
});

afterAll(async () => {
  await db.clearDatabase();
});

describe('CLINICAL HISTORY TREATMENT ENDPOINTS TEST', () => {
  describe('test POST /histories/:id/treatment', () => {

    it('should return 404 if clinical history is not found', async () => {
      const response = await request.post(`/histories/${uuidv4()}/treatment`).send({
        name: 'Antibiotics',
        startDate: new Date(),
        endDate: new Date(),
        instructions: 'Take twice daily'
      });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 400 if endDate is before startDate', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const treatmentData = {
        name: 'Antibiotics',
        startDate: new Date(),
        endDate: new Date(Date.now() - 86400000), // End date is before start date
        instructions: 'Take twice daily'
      };

      const response = await request.post(`/histories/${newClinicalHistory._id}/treatment`).send(treatmentData);
      expect(response.status).toBe(400);
      expect(response.body.errors['treatments.0.endDate']).toContain('End date must be today or in the future');
    });

    it('should return 200 and add treatment if clinical history exists', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const treatmentData = {
        name: 'Antibiotics',
        startDate: new Date(),
        endDate: new Date(),
        instructions: 'Take twice daily'
      };

      const response = await request.post(`/histories/${newClinicalHistory._id}/treatment`).send(treatmentData);
      expect(response.status).toBe(200);
      expect(response.body.treatments.length).toBe(1);
      expect(response.body.treatments[0].name).toBe(treatmentData.name);
    });
  });

  describe('test DELETE /histories/:id/treatment/:treatmentId', () => {

    it('should return 400 if treatment ID is not an ObjectID', async () => {
      const response = await request.delete(`/histories/${uuidv4()}/treatment/${uuidv4()}`);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Treatment ID is not valid');
    });

    it('should return 404 if clinical history is not found', async () => {
      const response = await request.delete(`/histories/${uuidv4()}/treatment/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 404 if treatment is not found', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const response = await request.delete(`/histories/${newClinicalHistory._id}/treatment/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Treatment not found');
    });

    it('should return 200 and delete treatment if treatment exists', async () => {
      const newClinicalHistory = new ClinicalHistory({
        patientId: uuidv4(),
        treatments: [{ name: 'Antibiotics', startDate: new Date(), endDate: new Date(), instructions: 'Take twice daily' }]
      });
      await newClinicalHistory.save();

      const treatmentId = newClinicalHistory.treatments[0]._id;
      const response = await request.delete(`/histories/${newClinicalHistory._id}/treatment/${treatmentId}`);
      expect(response.status).toBe(200);
      expect(response.body.treatments.length).toBe(0);

      const clinicalHistory = await ClinicalHistory.findById(newClinicalHistory._id);
      expect(clinicalHistory.treatments.length).toBe(0);
    });
  });

  describe('test PUT /histories/:id/treatment/:treatmentId', () => {

    it('should return 404 if clinical history is not found', async () => {
      const response = await request.put(`/histories/${uuidv4()}/treatment/${new mongoose.Types.ObjectId()}`).send({
        name: 'Updated Treatment',
        startDate: new Date(),
        endDate: new Date(),
        instructions: 'Updated instructions'
      });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 404 if treatment is not found', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const response = await request.put(`/histories/${newClinicalHistory._id}/treatment/${new mongoose.Types.ObjectId()}`).send({
        name: 'Updated Treatment',
        startDate: new Date(),
        endDate: new Date(),
        instructions: 'Updated instructions'
      });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Treatment not found');
    });

    it('should return 400 if endDate is before startDate', async () => {
      const newClinicalHistory = new ClinicalHistory({
        patientId: uuidv4(),
        treatments: [{ name: 'Antibiotics', startDate: new Date(), endDate: new Date(), instructions: 'Take twice daily' }]
      });
      await newClinicalHistory.save();

      const treatmentId = newClinicalHistory.treatments[0]._id;
      const updatedTreatmentData = {
        name: 'Updated Antibiotics',
        startDate: new Date(),
        endDate: new Date() - 86400000, // End date is before start date
        instructions: 'Updated instructions'
      };

      const response = await request.put(`/histories/${newClinicalHistory._id}/treatment/${treatmentId}`).send(updatedTreatmentData);
      expect(response.status).toBe(400);
      expect(response.body.errors['treatments.0.endDate']).toContain('End date must be today or in the future');
    });

    it('should return 200 and update treatment if treatment exists', async () => {
      const newClinicalHistory = new ClinicalHistory({
        patientId: uuidv4(),
        treatments: [{ name: 'Antibiotics', startDate: new Date(), endDate: new Date(), instructions: 'Take twice daily' }]
      });
      await newClinicalHistory.save();

      const treatmentId = newClinicalHistory.treatments[0]._id;
      const updatedTreatmentData = {
        name: 'Updated Antibiotics',
        startDate: new Date(),
        endDate: new Date(),
        instructions: 'Updated instructions'
      };

      const response = await request.put(`/histories/${newClinicalHistory._id}/treatment/${treatmentId}`).send(updatedTreatmentData);
      expect(response.status).toBe(200);
      expect(response.body.treatments[0].name).toBe(updatedTreatmentData.name);
    });
  });
});
