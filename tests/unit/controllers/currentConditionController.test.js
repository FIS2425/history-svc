import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';
import ClinicalHistory from '../../../src/models/ClinicalHistory.js';
import * as db from '../../setup/database';
import { request } from '../../setup/setup';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


const cookie = ['token=authToken&refreshToken=refreshToken'];

beforeAll(async () => {
  vi.spyOn(jwt, 'verify').mockReturnValue({
    userId: 'userId',
    roles: ['admin'],
  });
  await db.clearDatabase();
});

afterAll(async () => {
  vi.resetAllMocks();
});

describe('CLINICAL HISTORY CURRENT CONDITIONS ENDPOINTS TEST', () => {
  describe('test POST /histories/:id/condition', () => {

    it('should return 404 if clinical history is not found', async () => {
      const response = await request.post(`/histories/${uuidv4()}/condition`).send({
        name: 'Fever',
        details: 'High temperature'
      }).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 400 if since is in the future', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const conditionData = {
        name: 'Fever',
        details: 'High temperature',
        since: new Date(Date.now() + 86400000) // Since is in the future
      };

      const response = await request.post(`/histories/${newClinicalHistory._id}/condition`).send(conditionData).set('Cookie', cookie);
      expect(response.status).toBe(400);
      expect(response.body.errors['currentConditions.0.since']).toContain('Since must be today or in the past');
    });

    it('should return 200 and add condition if clinical history exists', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const conditionData = {
        name: 'Fever',
        details: 'High temperature'
      };

      const response = await request.post(`/histories/${newClinicalHistory._id}/condition`).send(conditionData).set('Cookie', cookie);
      expect(response.status).toBe(200);
      expect(response.body.currentConditions.length).toBe(1);
      expect(response.body.currentConditions[0].name).toBe(conditionData.name);
    });
  });

  describe('test DELETE /histories/:id/condition/:conditionId', () => {

    it('should return 400 if condition ID is not an ObjectID', async () => {
      const response = await request.delete(`/histories/${uuidv4()}/condition/${uuidv4()}`).set('Cookie', cookie);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Current condition ID is not valid');
    });

    it('should return 404 if clinical history is not found', async () => {
      const response = await request.delete(`/histories/${uuidv4()}/condition/${new mongoose.Types.ObjectId()}`).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 404 if condition is not found', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const response = await request.delete(`/histories/${newClinicalHistory._id}/condition/${new mongoose.Types.ObjectId()}`).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Current condition not found');
    });

    it('should return 200 and delete condition if condition exists', async () => {
      const newClinicalHistory = new ClinicalHistory({
        patientId: uuidv4(),
        currentConditions: [{ name: 'Fever', details: 'High temperature', since: new Date() }]
      });
      await newClinicalHistory.save();

      const conditionId = newClinicalHistory.currentConditions[0]._id;
      const response = await request.delete(`/histories/${newClinicalHistory._id}/condition/${conditionId}`).set('Cookie', cookie);
      expect(response.status).toBe(200);
      expect(response.body.currentConditions.length).toBe(0);

      const clinicalHistory = await ClinicalHistory.findById(newClinicalHistory._id);
      expect(clinicalHistory.currentConditions.length).toBe(0);
    });
  });

  describe('test PUT /histories/:id/condition/:conditionId', () => {

    it('should return 404 if clinical history is not found', async () => {
      const response = await request.put(`/histories/${uuidv4()}/condition/${new mongoose.Types.ObjectId()}`).send({
        name: 'Updated condition',
        details: 'Updated details'
      }).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Clinical history not found');
    });

    it('should return 404 if condition is not found', async () => {
      const newClinicalHistory = new ClinicalHistory({ patientId: uuidv4() });
      await newClinicalHistory.save();

      const response = await request.put(`/histories/${newClinicalHistory._id}/condition/${new mongoose.Types.ObjectId()}`).send({
        name: 'Updated condition',
        details: 'Updated details'
      }).set('Cookie', cookie);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Current condition not found');
    });

    it('should return 400 if since is in the future', async () => {
      const newClinicalHistory = new ClinicalHistory({
        patientId: uuidv4(),
        currentConditions: [{ name: 'Fever', details: 'High temperature', since: new Date() }]
      });
      await newClinicalHistory.save();

      const conditionId = newClinicalHistory.currentConditions[0]._id;
      const updatedconditionData = {
        since: new Date(Date.now() + 86400000) // Since is in the future
      };

      const response = await request.put(`/histories/${newClinicalHistory._id}/condition/${conditionId}`).send(updatedconditionData).set('Cookie', cookie);
      expect(response.status).toBe(400);
      expect(response.body.errors['currentConditions.0.since']).toContain('Since must be today or in the past');
    });

    it('should return 200 and update condition if condition exists', async () => {
      const newClinicalHistory = new ClinicalHistory({
        patientId: uuidv4(),
        currentConditions: [{ name: 'Fever', details: 'High temperature', since: new Date() }]
      });
      await newClinicalHistory.save();

      const conditionId = newClinicalHistory.currentConditions[0]._id;
      const updatedconditionData = {
        name: 'Updated Fever (V2)',
        details: 'Updated details'
      };
 
      const response = await request.put(`/histories/${newClinicalHistory._id}/condition/${conditionId}`).send(updatedconditionData).set('Cookie', cookie);
      expect(response.status).toBe(200);
      expect(response.body.currentConditions[0].name).toBe(updatedconditionData.name);
    });
  });
});
