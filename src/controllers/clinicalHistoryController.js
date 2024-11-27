import ClinicalHistory from '../models/ClinicalHistory.js';
import logger from '../config/logger.js';


// Create a new clinical history given a patient ID
const createClinicalHistory = async (req, res) => {
  const { patientId } = req.body;
  if (!patientId) {
    logger.error('createClinicalHistory - Patient ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Patient ID is required' });
  }
  try {
    const clinicalHistory = new ClinicalHistory({ patientId });
    await clinicalHistory.save();
    logger.info(`createClinicalHistory - Clinical history created for patient with ID: ${patientId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(201).json(clinicalHistory);
  } catch (error) {
    logger.error(error);
    if (error.name === 'ValidationError') {
      logger.error('createClinicalHistory - Validation Error', {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
        error: error
      });
      res.status(400).json({ message: error.message });
    } else if (error.code === 11000) {
      logger.error(`createClinicalHistory - Clinical history already exists for patient with ID: ${patientId}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
        error: error
      });
      res.status(400).json({ message: 'Clinical history already exists for patient' });
    } else {
      logger.error(`createClinicalHistory - Error creating clinical history for patient with ID: ${patientId}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
        error: error
      });
      res.status(500).json({ message: 'Error creating clinical history' });
    }
  }
}

// Get all clinical histories
const getAllClinicalHistories = async (req, res) => {
  try {
    const clinicalHistories = await ClinicalHistory.find();
    logger.info(`getAllClinicalHistories - Returning ${clinicalHistories.length} clinical histories`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinicalHistories);
  } catch (error) {
    logger.error(`getAllClinicalHistories - Error returning clinical histories: ${error.message}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: error
    });
    res.status(500).json({ message: 'Error getting clinical histories' });
  }
}

// Get a clinical history by ID
const getClinicalHistoryById = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  if (!clinicalHistoryId) {
    logger.error('getClinicalHistoryById - Clinical history ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }  
  try {
    const clinicalHistory = await ClinicalHistory.findById(clinicalHistoryId);
    if (!clinicalHistory) {
      logger.error(`getClinicalHistoryById - Clinical history with id ${clinicalHistoryId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    logger.info(`getClinicalHistoryById - Clinical history with id ${clinicalHistoryId} was found`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinicalHistory);
  } catch (error) {
    logger.error(`getClinicalHistoryById - Error returning clinical history with id ${clinicalHistoryId} :${error.message}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(500).json({ message: 'Error getting clinical history' });
  }
}

// Get a clinical history by patient ID
const getClinicalHistoryByPatientId = async (req, res) => {
  const patientId = req.params.patientId;
  if (!patientId) {
    logger.error('getClinicalHistoryByPatientId - Patient ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Patient ID is required' });
  }
  try {
    const clinicalHistory = await ClinicalHistory
      .findOne({ patientId: patientId });
    if (!clinicalHistory) {
      logger.error(`getClinicalHistoryByPatientId - Clinical history with patient id ${patientId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    logger.info(`getClinicalHistoryByPatientId - Clinical history with patient id ${patientId} was found`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinicalHistory);
  }
  catch (error) {
    logger.error(`getClinicalHistoryByPatientId - Error returning clinical history with patient id ${patientId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: error
    });
    res.status(500).json({ message: 'Error getting clinical history' });
  }
}

// Add an allergy to the allergies set in a clinical history
const addAllergy = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  const { allergy } = req.body;
  if (!clinicalHistoryId) {
    logger.error('addAllergy - Clinical history ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  if (!allergy) {
    logger.error('addAllergy - Allergy is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Allergy is required' });
  }
  try {
    const clinicalHistory = await ClinicalHistory.findByIdAndUpdate(
      clinicalHistoryId,
      { $addToSet: { allergies: allergy } },
      { new: true }
    );
    if (!clinicalHistory) {
      logger.error(`addAllergy - Clinical history with id ${clinicalHistoryId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    logger.info(`addAllergy - Allergy added to clinical history with id ${clinicalHistoryId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinicalHistory);
  } catch (error) {
    logger.error(`addAllergy - Error adding allergy to clinical history with id ${clinicalHistoryId} :${error.message}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: error
    });
    res.status(500).json({ message: 'Error adding allergy to clinical history' });
  }
}


// Remove an allergy from the allergies set in a clinical history
const removeAllergy = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  const { allergy } = req.params;
  if (!clinicalHistoryId) {
    logger.error('removeAllergy - Clinical history ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  if (!allergy) {
    logger.error('removeAllergy - Allergy is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Allergy is required' });
  }
  try {
    const clinicalHistory = await ClinicalHistory.findByIdAndUpdate(
      clinicalHistoryId,
      { $pull: { allergies: allergy } },
      { new: true }
    );
    if (!clinicalHistory) {
      logger.error(`removeAllergy - Clinical history with id ${clinicalHistoryId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    logger.info(`removeAllergy - Allergy removed from clinical history with id ${clinicalHistoryId}` , {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinicalHistory);
  } catch (error) {
    logger.error(`removeAllergy - Error removing allergy from clinical history with id ${clinicalHistoryId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: error
    });
    res.status(500).json({ message: 'Error removing allergy from clinical history' });
  }
}

// Delete a clinical history by ID
const deleteClinicalHistoryById = async (req, res) => {
  const clinicalHIstoryId = req.params.id;
  if (!clinicalHIstoryId) {
    logger.error('deleteClinicalHistoryById - Clinical history ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  try {
    const deleted = await ClinicalHistory.findByIdAndDelete(clinicalHIstoryId);
    if (!deleted) {
      logger.error(`deleteClinicalHistoryById - Clinical history with id ${clinicalHIstoryId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    logger.info(`deleteClinicalHistoryById - Clinical history with id ${clinicalHIstoryId} was deleted`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(204).end();
  } catch (error) {
    logger.error(`deleteClinicalHistoryById - Error deleting clinical history with id ${clinicalHIstoryId} :${error.message}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(500).json({ message: 'Error deleting clinical history' });
  }
}

// Delete a clinical history by patient ID
const deleteClinicalHistoryByPatientId = async (req, res) => {
  const patientId = req.params.patientId;
  if (!patientId) {
    logger.error('deleteClinicalHistoryByPatientId - Patient ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Patient ID is required' });
  }
  try {
    const deleted = await ClinicalHistory.findOneAndDelete({ patientId });
    if (!deleted) {
      logger.error(`deleteClinicalHistoryByPatientId - Clinical history with patient id ${patientId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    logger.info(`deleteClinicalHistoryByPatientId - Clinical history with patient id ${patientId} was deleted`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(204).end();
  } catch (error) {
    logger.error(`deleteClinicalHistoryByPatientId - Error deleting clinical history with patient id ${patientId} :${error.message}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: error
    });
    res.status(500).json({ message: 'Error deleting clinical history' });
  }
}

export {
  createClinicalHistory,
  getAllClinicalHistories,
  getClinicalHistoryById,
  getClinicalHistoryByPatientId,
  addAllergy,
  removeAllergy,
  deleteClinicalHistoryById,
  deleteClinicalHistoryByPatientId
};