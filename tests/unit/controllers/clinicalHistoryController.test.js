import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import ClinicalHistory from '../../../src/models/ClinicalHistory.js';
import * as db from '../../setup/database';
import { request } from '../../setup/setup';
import { v4 as uuidv4 } from 'uuid';

beforeAll(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.clearDatabase();
});

describe('CLINICAL HISTORY ENDPOINTS TEST', () => {
  describe('test POST /histories', () => {
    it('should return 400 if patientId is not provided', async () => {
      const response = await request.post('/histories').send({});
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Patient ID is required');
    });

    it('should return 201 and create a clinical history if patientId is provided', async () => {
      const newClinicalHistory = { patientId: uuidv4() };
      const response = await request.post('/histories').send(newClinicalHistory);
      expect(response.status).toBe(201);
      expect(response.body.patientId).toBe(newClinicalHistory.patientId);
    });
  });

  describe('test GET /histories', () => {
    it('should return 200 and all clinical histories', async () => {
      const response = await request.get('/histories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('test GET /histories/:id', () => {
    it('should return 404 if clinical history is not found', async () => {
      const response = await request.get(`/histories/${uuidv4()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 200 if clinical history is found', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const response = await request.get(`/histories/${newClinicalHistory._id}`);
      expect(response.status).toBe(200);
      expect(response.body.patientId).toBe(newClinicalHistory.patientId);
    });
  });

  describe('test GET /histories/patient/:patientId', () => {
    it('should return 404 if clinical history by patient ID is not found', async () => {
      const response = await request.get(`/histories/patient/${uuidv4()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 200 if clinical history by patient ID is found', async () => {
      const patientId = uuidv4();
      const newClinicalHistory = new ClinicalHistory({ patientId });
      await newClinicalHistory.save();

      const response = await request.get(`/histories/patient/${patientId}`);
      expect(response.status).toBe(200);
      expect(response.body.patientId).toBe(patientId);
    });
  });

  describe('test DELETE /histories/:id', () => {
    it('should return 404 if clinical history to delete is not found', async () => {
      const response = await request.delete(`/histories/${uuidv4()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 204 if clinical history is successfully deleted', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const response = await request.delete(`/histories/${newClinicalHistory._id}`);
      expect(response.status).toBe(204);
    });
  });

  describe('test DELETE /histories/patient/:patientId', () => {
    it('should return 404 if clinical history to delete by patient ID is not found', async () => {
      const response = await request.delete(`/histories/patient/${uuidv4()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 204 if clinical history by patient ID is successfully deleted', async () => {
      const patientId = uuidv4();
      const newClinicalHistory = new ClinicalHistory({ patientId });
      await newClinicalHistory.save();

      const response = await request.delete(`/histories/patient/${patientId}`);
      expect(response.status).toBe(204);
    });
  });
});
