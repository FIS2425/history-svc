import * as clinicalHistoryController from '../controllers/clinicalHistoryController.js';
import express from 'express';
const router = express.Router();

router.delete('/patient/:patientId', clinicalHistoryController.deleteClinicalHistoryByPatientId);
router.post('/', clinicalHistoryController.createClinicalHistory);
router.get('/', clinicalHistoryController.getAllClinicalHistories);
router.get('/:id', clinicalHistoryController.getClinicalHistoryById);
router.get('/patient/:patientId', clinicalHistoryController.getClinicalHistoryByPatientId);
router.delete('/:id', clinicalHistoryController.deleteClinicalHistoryById);

export default router;