import ClinicalHistory from '../models/ClinicalHistory.js';
import logger from '../config/logger.js';
import pdfkit from 'pdfkit';
import axios from 'axios';
import CircuitBreaker from 'opossum';
import redisClient from '../config/redis.js';

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

async function getPatient(patientId, token) {
  try {
    const response = await axios.get(`${process.env.PATIENT_SVC}/patients/${patientId}`, {
      withCredentials: true,
      headers: {
        'Cookie': `token=${token}`
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      logger.error(`Failed to fetch patient data. Status: ${status}. Message: ${data.message || 'Unknown error'}`);
      throw new Error(`Failed to fetch patient data. Status: ${status}. Message: ${data.message || 'Unknown error'}`);
    }
    throw new Error('Failed to fetch patient data. Service is unreachable.');
  }
}

async function getAppointments(patientId, token) {
  try {
    const response = await axios.get(`${process.env.APPOINTMENT_SVC}/appointments/patient/${patientId}`, {
      withCredentials: true,
      headers: {
        'Cookie': `token=${token}`
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      logger.error(`Failed to fetch appointments. Status: ${status}. Message: ${data.message || 'Unknown error'}`);
      throw new Error(`Failed to fetch appointments. Status: ${status}. Message: ${data.message || 'Unknown error'}`);
    }
    throw new Error('Failed to fetch appointments. Service is unreachable.');
  }
}

const circuitBreakerOptions = {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};

// Circuito para getPatient
const getPatientBreaker = new CircuitBreaker(getPatient, circuitBreakerOptions);

// Circuito para getAppointments
const getAppointmentsBreaker = new CircuitBreaker(getAppointments, circuitBreakerOptions);

// Escuchar eventos de los circuitos
[getPatientBreaker, getAppointmentsBreaker].forEach((breaker, index) => {
  breaker.on('open', () => logger.warn(`${ index == 0 ? 'Patient' : 'Appointment' } circuit open: No requests allowed.`));
  breaker.on('close', () => logger.info(`${ index == 0 ? 'Patient' : 'Appointment' } circuit closed: Requests allowed.`));
  breaker.on('halfOpen', () => logger.info(`${ index == 0 ? 'Patient' : 'Appointment' } circuit half open: Testing disponibility.`));
  breaker.on('stats', (stats) => logger.info(`${ index == 0 ? 'Patient' : 'Appointment' } circuit stats: ${JSON.stringify(stats)}`));
});

const getPdfReport = async (req, res) => {
  const clinicalHistoryId = req.params.id;
  if (!clinicalHistoryId) {
    logger.error('getPdfReport - Clinical history ID is required', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'Clinical history ID is required' });
  }
  const clinicalHistory = await ClinicalHistory.findById(clinicalHistoryId);
  if (!clinicalHistory) {
    logger.error(`getPdfReport - Clinical history with id ${clinicalHistoryId} was not found`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(404).json({ message: 'Clinical history not found' });
  }

  // Patient info
  // name, surname, birthdate, dni, city
  var patient;

  //Check if the patient is in the cache
  const cahedPatient = await redisClient.get(`patient:${clinicalHistory.patientId}`);
  if (cahedPatient) {
    patient = JSON.parse(cahedPatient);
    logger.info(`getPdfReport - Patient data retrieved from cache for patient with id ${clinicalHistory.patientId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
  } else {
    try {
      patient = await getPatientBreaker.fire(clinicalHistory.patientId, req.token);
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }
    // Save patient in cache for 1 hour
    redisClient.set(`patient:${clinicalHistory.patientId}`, JSON.stringify(patient), 'EX', 3600);
  }

  // Appointments
  // [{specialty, type, appointmentDate}] --> status = completed
  var appointments;
  try {
    appointments = await getAppointmentsBreaker.fire(clinicalHistory.patientId, req.token);
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
  
  // Conditions
  // [{name, details, since}]
  const conditions = clinicalHistory.currentConditions;

  // Treatments
  // [{name, startDate, endDate, instructions}]
  const treatments = clinicalHistory.treatments;

  // Allergies
  // [string]
  const allergies = clinicalHistory.allergies;

  try {
    const dateFormat = Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dateTimeFormat = Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=clinical-history-report.pdf',
    });

    const doc = new pdfkit();

    doc.pipe(stream);
    
    // Header
    doc.fontSize(12).font('Helvetica-Bold').text('CloudMedix', {align: 'right'}).font('Helvetica');
    doc.moveDown(1);

    // Title Section
    doc.fontSize(18).font('Helvetica-Bold').text('Clinical History Report', { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke('#cccccc');
    doc.moveDown(1);

    doc.fontSize(12).font('Helvetica');

    // Patient Information
    doc.font('Helvetica-Bold').fillOpacity(0.5).text('PATIENT IDENTIFICATION');
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fillOpacity(1).text(`${patient.name} ${patient.surname}`);
    doc.font('Helvetica').text(`Birthdate: ${dateFormat.format(new Date(patient.birthdate))}`, { indent: 20 });
    doc.font('Helvetica').text(`DNI: ${patient.dni}`, { indent: 20 });
    doc.font('Helvetica').text(`City: ${patient.city}`, { indent: 20 });
    doc.moveDown(1);
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke('#cccccc');
    doc.moveDown(1);

    // Appointments Section
    doc.font('Helvetica-Bold').fillOpacity(0.5).text('APPOINTMENTS');
    doc.moveDown(0.5);
    if (appointments && appointments.length > 0) {
      appointments.forEach((appointment) => {
        doc.font('Helvetica-Bold').fillOpacity(1).text(`${appointment.specialty}`);
        doc.font('Helvetica').text(`${appointment.type} - ${dateTimeFormat.format(new Date(appointment.appointmentDate))}`, { indent: 20 });
        doc.moveDown(0.5);
        doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).dash(5, { space: 5 }).stroke('#cccccc');
        doc.undash();
        doc.moveDown(0.5);
      });
    } else {
      doc.font('Helvetica-Italic').fillOpacity(0.7).text('No appointments available.');
    }
    doc.moveDown(1);
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke('#cccccc');
    doc.moveDown(1);

    // Conditions Section
    doc.font('Helvetica-Bold').fillOpacity(0.5).text('MEDICAL CONDITIONS');
    doc.moveDown(0.5);
    if (conditions && conditions.length > 0) {
      conditions.forEach((condition) => {
        doc.font('Helvetica-Bold').fillOpacity(1).text(`${condition.name}`);
        doc.font('Helvetica').text(`Details: ${condition.details}`, { indent: 20 });
        doc.font('Helvetica').text(`Since: ${dateFormat.format(new Date(condition.since))}`, { indent: 20 });
        if (condition.until) doc.font('Helvetica').text(`Until: ${dateFormat.format(new Date(condition.until))}`, { indent: 20 });
        doc.moveDown(0.5);
        doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).dash(5, { space: 5 }).stroke('#cccccc');
        doc.undash();
        doc.moveDown(0.5);
      });
    } else {
      doc.font('Helvetica-Italic').fillOpacity(0.7).text('No medical conditions available.');
    }
    doc.moveDown(1);
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke('#cccccc');
    doc.moveDown(1);

    // Treatments Section
    doc.font('Helvetica-Bold').fillOpacity(0.5).text('TREATMENTS');
    doc.moveDown(0.5);
    if (treatments && treatments.length > 0) {
      treatments.forEach((treatment) => {
        doc.font('Helvetica-Bold').fillOpacity(1).text(`${treatment.name}`);
        doc.font('Helvetica').text(`Start Date: ${dateFormat.format(new Date(treatment.startDate))}`, { indent: 20 });
        doc.font('Helvetica').text(`End Date: ${dateFormat.format(new Date(treatment.endDate))}`, { indent: 20 });
        doc.font('Helvetica').text(`Instructions: ${treatment.instructions}`, { indent: 20 });
        doc.moveDown(0.5);
        doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).dash(5, { space: 5 }).stroke('#cccccc');
        doc.undash();
        doc.moveDown(0.5);
      });
    } else {
      doc.font('Helvetica-Italic').fillOpacity(0.7).text('No treatments available.');
    }
    doc.moveDown(1);
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke('#cccccc');
    doc.moveDown(1);

    // Allergies Section
    doc.font('Helvetica-Bold').fillOpacity(0.5).text('ALLERGIES');
    doc.moveDown(0.5);
    if (allergies && allergies.length > 0) {
      allergies.forEach((allergy, index) => {
        doc.font('Helvetica').fillOpacity(1).text(`${index + 1}. ${allergy}`);
      });
    } else {
      doc.font('Helvetica-Italic').fillOpacity(0.7).text('No allergies available.');
    }
    doc.moveDown(1);
    doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke('#cccccc');
    doc.moveDown(1);

    // Footer
    doc.fontSize(10).font('Helvetica-Oblique')
      .text('Generated on: ' + new Date().toLocaleDateString(), { align: 'right'})
      .fontSize(10).font('Helvetica-Bold')
      .text('CloudMedix', { align: 'right'});

    doc.end();

    logger.info(`getPdfReport - Clinical history report generated for clinical history with id ${clinicalHistoryId}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
  } catch (error) {
    logger.error(`getPdfReport - Error generating clinical history report with id ${clinicalHistoryId} :${error.message}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    res.status(500).json({ message: 'Error generating clinical history report' });
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
  deleteClinicalHistoryByPatientId,
  getPdfReport
};