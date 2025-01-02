import * as clinicalHistoryController from '../controllers/clinicalHistoryController.js';
import * as treatmentController from '../controllers/treatmentController.js';
import * as currentConditionController from '../controllers/currentConditionController.js';
import * as fileController from '../controllers/fileController.js';
import express from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import { verifyAdmin, verifyDoctorOrHigher, verifyPatientOrHigher } from '../middleware/verifyAuth.js';
const router = express.Router();

// Clinical history routes
router.delete('/patient/:patientId', verifyDoctorOrHigher, clinicalHistoryController.deleteClinicalHistoryByPatientId);
router.post('/', verifyDoctorOrHigher, clinicalHistoryController.createClinicalHistory);
router.get('/', verifyAdmin, clinicalHistoryController.getAllClinicalHistories);
router.get('/:id', verifyPatientOrHigher, clinicalHistoryController.getClinicalHistoryById);
router.get('/patient/:patientId', verifyPatientOrHigher, clinicalHistoryController.getClinicalHistoryByPatientId);
router.delete('/:id', verifyDoctorOrHigher, clinicalHistoryController.deleteClinicalHistoryById);
router.get('/:id/report', verifyPatientOrHigher, clinicalHistoryController.getPdfReport);

// Allergies routes
router.post('/:id/allergy', verifyDoctorOrHigher, clinicalHistoryController.addAllergy);
router.delete('/:id/allergy/:allergy', verifyDoctorOrHigher, clinicalHistoryController.removeAllergy);

// Treatment routes
router.post('/:id/treatment', verifyDoctorOrHigher, treatmentController.addTreatment);
router.delete('/:id/treatment/:treatmentId', verifyDoctorOrHigher, treatmentController.deleteTreatment);
router.put('/:id/treatment/:treatmentId', verifyDoctorOrHigher, treatmentController.updateTreatment);

// Current condition routes
router.post('/:id/condition', verifyDoctorOrHigher, currentConditionController.addCurrentCondition);
router.delete('/:id/condition/:currentConditionId', verifyDoctorOrHigher, currentConditionController.deleteCurrentCondition);
router.put('/:id/condition/:currentConditionId', verifyDoctorOrHigher, currentConditionController.updateCurrentCondition);

// File routes
router.post('/:id/image', verifyDoctorOrHigher, uploadMiddleware, fileController.handleFileUpload);
router.delete('/:id/image/:fileId', verifyDoctorOrHigher, fileController.deleteFile);
router.post('/:id/analytic',verifyDoctorOrHigher, uploadMiddleware, fileController.handleFileUpload);
router.delete('/:id/analytic/:fileId', verifyDoctorOrHigher, fileController.deleteFile);

export default router;