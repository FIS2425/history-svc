import ClinicalHistory from '../models/ClinicalHistory.js';
import logger from '../config/logger.js';
import mongoose from 'mongoose';

//Add a new treatment to a clinical history
const addTreatment = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  if (!clinicalHistoryId) {
    logger.error('addTreatment - Clinical history ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  
  const { name, startDate, endDate, instructions } = req.body;
    
  try {
    const clinicalHistory = await ClinicalHistory.findById(clinicalHistoryId);
    if (!clinicalHistory) {
      logger.error(`addTreatment - Clinical history with id ${clinicalHistoryId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    clinicalHistory.treatments.push({ name, startDate, endDate, instructions });

    await clinicalHistory.save();

    logger.info(`addTreatment - Treatment added to clinical history with id ${clinicalHistoryId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinicalHistory);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = acc[key] || [];
        acc[key].push(error.errors[key].message);
        return acc;
      }, {});
      logger.error(`addTreatment - Validation error: ${JSON.stringify(errors)}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
        error: errors,
      });
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      logger.error(`addTreatment - Error adding treatment to clinical history with id ${clinicalHistoryId}: ${error.message}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      res.status(500).json({ message: 'Error adding treatment' });
    }
  }
}

//Delete a treatment from a clinical history
const deleteTreatment = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  const treatmentId = req.params.treatmentId;
  if (!clinicalHistoryId) {
    logger.error('deleteTreatment - Clinical history ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  if (!treatmentId) {
    logger.error('deleteTreatment - Treatment ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Treatment ID is required' });
  }
  // Is the ID a valid ObjectId?
  if (!mongoose.Types.ObjectId.isValid(treatmentId)) {
    logger.error(`deleteTreatment - Treatment ID ${treatmentId} is not a valid ObjectId`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Treatment ID is not valid' });
  }
  try {
    const clinicalHistory = await ClinicalHistory.findById(clinicalHistoryId);
    if (!clinicalHistory) {
      logger.error(`deleteTreatment - Clinical history with id ${clinicalHistoryId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    const treatment = clinicalHistory.treatments.id(treatmentId);
    if (!treatment) {
      logger.error(`deleteTreatment - Treatment with id ${treatmentId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Treatment not found' });
    }
    treatment.deleteOne();
    await clinicalHistory.save();
    logger.info(`deleteTreatment - Treatment with id ${treatmentId} deleted from clinical history with id ${clinicalHistoryId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinicalHistory);
  } catch (error) {
    logger.error(`deleteTreatment - Error deleting treatment with id ${treatmentId} from clinical history with id ${clinicalHistoryId} :${error.message}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(500).json({ message: 'Error deleting treatment' });
  }
}

//Update a treatment from a clinical history
const updateTreatment = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  const treatmentId = req.params.treatmentId;
  if (!clinicalHistoryId) {
    logger.error('updateTreatment - Clinical history ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  if (!treatmentId) {
    logger.error('updateTreatment - Treatment ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Treatment ID is required' });
  }
  // Is the ID a valid ObjectId?
  if (!mongoose.Types.ObjectId.isValid(treatmentId)) {
    logger.error(`updateTreatment - Treatment ID ${treatmentId} is not a valid ObjectId`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Treatment ID is not valid' });
  }

  const { name, startDate, endDate, instructions } = req.body;
  try {
    const clinicalHistory = await ClinicalHistory.findById(clinicalHistoryId);
    if (!clinicalHistory) {
      logger.error(`updateTreatment - Clinical history with id ${clinicalHistoryId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    const treatment = clinicalHistory.treatments.id(treatmentId);
    if (!treatment) {
      logger.error(`updateTreatment - Treatment with id ${treatmentId} was not found`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      return res.status(404).json({ message: 'Treatment not found' });
    }
    if (name) treatment.name = name;
    if (startDate) treatment.startDate = startDate;
    if (endDate) treatment.endDate = endDate;
    if (instructions) treatment.instructions = instructions;
    await clinicalHistory.save();
    logger.info(`updateTreatment - Treatment with id ${treatmentId} updated in clinical history with id ${clinicalHistoryId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(200).json(clinicalHistory);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = acc[key] || [];
        acc[key].push(error.errors[key].message);
        return acc;
      }, {});
      logger.error(`updateTreatment - Validation error: ${JSON.stringify(errors)}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
        error: errors,
      });
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      logger.error(`updateTreatment - Error updating treatment with id ${treatmentId} from clinical history with id ${clinicalHistoryId}: ${error.message}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
        requestId: req.headers && req.headers['x-request-id'] || null,
      });
      res.status(500).json({ message: 'Error updating treatment' });
    }
  }
}

export {
  addTreatment,
  deleteTreatment,
  updateTreatment 
}