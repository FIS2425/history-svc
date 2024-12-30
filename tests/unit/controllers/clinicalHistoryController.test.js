import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import ClinicalHistory from '../../../src/models/ClinicalHistory.js';
import * as db from '../../setup/database';
import { request } from '../../setup/setup';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const cookie = ['token=authToken&refreshToken=refreshToken'];

beforeEach(async () => {
  vi.spyOn(jwt, 'verify').mockReturnValue({
    userId: 'userId',
    roles: ['admin'],
  });
  await db.clearDatabase();
});

afterEach(async () => {
  vi.resetAllMocks();
});

describe('CLINICAL HISTORY ENDPOINTS TEST', () => {
  describe('test POST /histories', () => {
    it('should return 400 if patientId is not provided', async () => {
      const response = await request.post('/histories').send({}).set('Cookie', cookie);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Patient ID is required');
    });

    it('should return 201 and create a clinical history if patientId is provided', async () => {
      const newClinicalHistory = { patientId: uuidv4() };
      const response = await request.post('/histories').send(newClinicalHistory).set('Cookie', cookie);
      expect(response.status).toBe(201);
      expect(response.body.patientId).toBe(newClinicalHistory.patientId);
    });
  });

  describe('test GET /histories', () => {
    it('should return 200 and all clinical histories', async () => {
      const response = await request.get('/histories').set('Cookie', cookie);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('test GET /histories/:id', () => {
    it('should return 404 if clinical history is not found', async () => {
      const response = await request.get(`/histories/${uuidv4()}`).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });
    it('should return 403 if patientId is not the current userId', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      vi.spyOn(jwt, 'verify').mockReturnValueOnce({
        userId: 'anotherUserId',
        roles: ['patient'],
        patientId: uuidv4(),
      });

      const response = await request.get(`/histories/${newClinicalHistory._id}`).set('Cookie', cookie);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied: Insufficient permissions');
    });
    it('should return 200 if clinical history is found', async () => {
      const id = uuidv4();
      const newClinicalHistory = new ClinicalHistory({ patientId: id });
      await newClinicalHistory.save();

      vi.spyOn(jwt, 'verify').mockReturnValueOnce({
        userId: 'userId',
        roles: ['patient'],
        patientId: id,
      });

      const response = await request.get(`/histories/${newClinicalHistory._id}`).set('Cookie', cookie);
      expect(response.status).toBe(200);
      expect(response.body.patientId).toBe(newClinicalHistory.patientId);
    });
  });

  describe('test GET /histories/patient/:patientId', () => {
    it('should return 404 if clinical history by patient ID is not found', async () => {
      const response = await request.get(`/histories/patient/${uuidv4()}`).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 403 if patientId is not the current user patientId', async () => {
      const id = uuidv4();
      const newClinicalHistory = new ClinicalHistory({ patientId: id });
      await newClinicalHistory.save();

      vi.spyOn(jwt, 'verify').mockReturnValueOnce({
        userId: 'anotherUserId',
        roles: ['patient'],
        patientId: uuidv4(),
      });

      const response = await request.get(`/histories/patient/${id}`).set('Cookie', cookie);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied: Insufficient permissions');
    });
    it('should return 200 if clinical history by patient ID is found', async () => {
      const id = uuidv4();
      const newClinicalHistory = new ClinicalHistory({ patientId: id });
      await newClinicalHistory.save();

      vi.spyOn(jwt, 'verify').mockReturnValueOnce({
        userId: 'userId',
        roles: ['patient'],
        patientId: id,
      });

      const response = await request.get(`/histories/patient/${id}`).set('Cookie', cookie);
      expect(response.status).toBe(200);
      expect(response.body.patientId).toBe(id);
    });
  });

  describe('test POST /histories/:id/allergy', () => {
    it('should return 400 if allergy is not provided', async () => {
      const response = await request.post(`/histories/${uuidv4()}/allergy`).send({}).set('Cookie', cookie);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Allergy is required');
    });

    it('should return 404 if clinical history to add allergy is not found', async () => {
      const response = await request.post(`/histories/${uuidv4()}/allergy`).send({ allergy: 'Peanuts' }).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 200 and add an allergy to clinical history', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const response = await request.post(`/histories/${newClinicalHistory._id}/allergy`).send({ allergy: 'Peanuts' }).set('Cookie', cookie);
      expect(response.status).toBe(200);
      expect(response.body.allergies).toContain('Peanuts');
    });
  });

  describe('test DELETE /histories/:id/allergy/:allergy', () => {
    it('should return 404 if clinical history to remove allergy is not found', async () => {
      const response = await request.delete(`/histories/${uuidv4()}/allergy/Peanuts`).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 200 and remove an allergy from clinical history', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4(), allergies: ['Peanuts'] });
      await newClinicalHistory.save();

      const response = await request.delete(`/histories/${newClinicalHistory._id}/allergy/Peanuts`).set('Cookie', cookie);
      expect(response.status).toBe(200);
      expect(response.body.allergies).not.toContain('Peanuts');
    });
  });

  describe('test DELETE /histories/:id', () => {
    it('should return 404 if clinical history to delete is not found', async () => {
      const response = await request.delete(`/histories/${uuidv4()}`).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 204 if clinical history is successfully deleted', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const response = await request.delete(`/histories/${newClinicalHistory._id}`).set('Cookie', cookie);
      expect(response.status).toBe(204);
    });
  });

  describe('test DELETE /histories/patient/:patientId', () => {
    it('should return 404 if clinical history to delete by patient ID is not found', async () => {
      const response = await request.delete(`/histories/patient/${uuidv4()}`).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 204 if clinical history by patient ID is successfully deleted', async () => {
      const patientId = uuidv4();
      const newClinicalHistory = new ClinicalHistory({ patientId });
      await newClinicalHistory.save();

      const response = await request.delete(`/histories/patient/${patientId}`).set('Cookie', cookie);
      expect(response.status).toBe(204);
    });
  });
});
