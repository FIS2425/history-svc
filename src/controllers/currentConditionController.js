import ClinicalHistory from '../models/ClinicalHistory.js';
import logger from '../config/logger.js';
import mongoose from 'mongoose';

//Add a new current condition to a clinical history
const addCurrentCondition = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  if (!clinicalHistoryId) {
    logger.error('addCurrentCondition - Clinical history ID is required');
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  
  const { name, details, since } = req.body;
  
  try {
    const clinicalHistory = await ClinicalHistory.findById(clinicalHistoryId);
    if (!clinicalHistory) {
      logger.error(`addCurrentCondition - Clinical history with id ${clinicalHistoryId} was not found`);
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    clinicalHistory.currentConditions.push({ name, details, since });

    await clinicalHistory.save();

    logger.info(`addCurrentCondition - Current condition added to clinical history with id ${clinicalHistoryId}`);
    res.status(200).json(clinicalHistory);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = acc[key] || [];
        acc[key].push(error.errors[key].message);
        return acc;
      }, {});
      logger.error(`addCurrentCondition - Validation error: ${JSON.stringify(errors)}`);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      logger.error(`addCurrentCondition - Error adding current condition to clinical history with id ${clinicalHistoryId}: ${error}`);
      res.status(500).json({ message: 'Error adding current condition' });
    }
  }
}

//Delete a current condition from a clinical history
const deleteCurrentCondition = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  const currentConditionId = req.params.currentConditionId;
  if (!clinicalHistoryId) {
    logger.error('deleteCurrentCondition - Clinical history ID is required');
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  if (!currentConditionId) {
    logger.error('deleteCurrentCondition - Current condition ID is required');
    return res.status(400).json({ message: 'Current condition ID is required' });
  }
  // Is the ID a valid ObjectId?
  if (!mongoose.Types.ObjectId.isValid(currentConditionId)) {
    logger.error(`deleteCurrentCondition - Current condition ID ${currentConditionId} is not a valid ObjectId`);
    return res.status(400).json({ message: 'Current condition ID is not valid' });
  }
  try {
    const clinicalHistory = await ClinicalHistory.findById(clinicalHistoryId);
    if (!clinicalHistory) {
      logger.error(`deleteCurrentCondition - Clinical history with id ${clinicalHistoryId} was not found`);
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    const currentCondition = clinicalHistory.currentConditions.id(currentConditionId);
    if (!currentCondition) {
      logger.error(`deleteCurrentCondition - Current condition with id ${currentConditionId} was not found`);
      return res.status(404).json({ message: 'Current condition not found' });
    }
    currentCondition.deleteOne();
    await clinicalHistory.save();
    logger.info(`deleteCurrentCondition - Current condition with id ${currentConditionId} deleted from clinical history with id ${clinicalHistoryId}`);
    res.status(200).json(clinicalHistory);
  } catch (error) {
    logger.error(`deleteCurrentCondition - Error deleting current condition with id ${currentConditionId} from clinical history with id ${clinicalHistoryId} :${error}`);
    res.status(500).json({ message: 'Error deleting current condition' });
  }
}

//Update a current condition from a clinical history
const updateCurrentCondition = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  const currentConditionId = req.params.currentConditionId;
  if (!clinicalHistoryId) {
    logger.error('updateCurrentCondition - Clinical history ID is required');
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  if (!currentConditionId) {
    logger.error('updateCurrentCondition - Current condition ID is required');
    return res.status(400).json({ message: 'Current condition ID is required' });
  }
  // Is the ID a valid ObjectId?
  if (!mongoose.Types.ObjectId.isValid(currentConditionId)) {
    logger.error(`updateCurrentCondition - Current condition ID ${currentConditionId} is not a valid ObjectId`);
    return res.status(400).json({ message: 'Current condition ID is not valid' });
  }

  const { name, details, since } = req.body;
  try {
    const clinicalHistory = await ClinicalHistory.findById(clinicalHistoryId);
    if (!clinicalHistory) {
      logger.error(`updateCurrentCondition - Clinical history with id ${clinicalHistoryId} was not found`);
      return res.status(404).json({ message: 'Clinical history not found' });
    }
    const currentCondition = clinicalHistory.currentConditions.id(currentConditionId);
    if (!currentCondition) {
      logger.error(`updateCurrentCondition - Current condition with id ${currentConditionId} was not found`);
      return res.status(404).json({ message: 'Current condition not found' });
    }
    if (name) currentCondition.name = name;
    if (details) currentCondition.details = details;
    if (since) currentCondition.since = since;
    await clinicalHistory.save();
    logger.info(`updateCurrentCondition - Current condition with id ${currentConditionId} updated in clinical history with id ${clinicalHistoryId}`);
    res.status(200).json(clinicalHistory);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = acc[key] || [];
        acc[key].push(error.errors[key].message);
        return acc;
      }, {});
      logger.error(`updateCurrentCondition - Validation error: ${JSON.stringify(errors)}`);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      logger.error(`updateCurrentCondition - Error updating current condition with id ${currentConditionId} from clinical history with id ${clinicalHistoryId}: ${error}`);
      res.status(500).json({ message: 'Error updating treatment' });
    }
  }
}

export {
  addCurrentCondition,
  deleteCurrentCondition,
  updateCurrentCondition
}