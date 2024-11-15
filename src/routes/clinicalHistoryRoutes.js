import * as clinicalHistoryController from '../controllers/clinicalHistoryController.js';
import * as treatmentController from '../controllers/treatmentController.js';
import express from 'express';
const router = express.Router();

// Clinical history routes
router.delete('/patient/:patientId', clinicalHistoryController.deleteClinicalHistoryByPatientId);
router.post('/', clinicalHistoryController.createClinicalHistory);
router.get('/', clinicalHistoryController.getAllClinicalHistories);
router.get('/:id', clinicalHistoryController.getClinicalHistoryById);
router.get('/patient/:patientId', clinicalHistoryController.getClinicalHistoryByPatientId);
router.delete('/:id', clinicalHistoryController.deleteClinicalHistoryById);

// Treatment routes
router.post('/:id/treatment', treatmentController.addTreatment);
router.delete('/:id/treatment/:treatmentId', treatmentController.deleteTreatment);
router.put('/:id/treatment/:treatmentId', treatmentController.updateTreatment);

export default router;