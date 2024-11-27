import { BlobServiceClient } from '@azure/storage-blob';
import logger from '../config/logger.js';
import ClinicalHistory from '../models/ClinicalHistory.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';

const sasToken = process.env.AZURE_SAS_TOKEN;
const accountName = process.env.AZURE_ACCOUNT_NAME;
const containerNames = {
  image: process.env.AZURE_IMAGES_CONTAINER_NAME,
  analytic: process.env.AZURE_ANALYTICS_CONTAINER_NAME
};
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClients = {
  image: blobServiceClient.getContainerClient(containerNames.image),
  analytic: blobServiceClient.getContainerClient(containerNames.analytic)
};

const uploadFileStream = async (fileName, filePath, mimeType, resourceType) => {
  const blobClient = containerClients[resourceType].getBlockBlobClient(fileName);
  // Upload file from disk
  const fileBuffer = await fs.readFile(filePath);
  await blobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });

  // Delete the local file
  await fs.unlink(filePath);

  return blobClient.url;
}

const deleteBlob = async (blobName, resourceType) => {
  const blobClient = containerClients[resourceType].getBlockBlobClient(blobName);
  try {
    await blobClient.delete();
  } catch (error) {
    if (error.code === 'BlobNotFound') {
      return false;
    } else {
      throw error;
    }
  }
  return true;
}


const handleFileUpload = async (req, res) => {
  const { id } = req.params;
  const resourceType = req.path.includes('/image') ? 'image' : 'analytic';

  if (!id) {
    return res.status(400).json({ message: 'clinicalHistoryId is required' });
  }

  const clinicalHistory = await ClinicalHistory.findById(id);

  if (!clinicalHistory) {
    logger.error(`handleFileUpload - Clinical history with id ${id} was not found`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(404).json({ message: 'Clinical history not found' });
  }

  const file = req.file;
  const fileName = file.filename
  const filePath = file.path;
  const mimeType = file.mimetype;
  const originalName = file.originalname;

  try {

    logger.debug(`handleFileUpload - Extracted metadata: ${fileName}, ${filePath}, ${mimeType}, ${originalName}`);

    const url = await uploadFileStream(fileName, filePath, mimeType, resourceType);
    logger.info(`handleFileUpload - File uploaded to Azure Blob Storage: ${url}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });

    if (resourceType === 'image') {
      clinicalHistory.images.push({ name: fileName, url: url, originalName: originalName });
    } else {
      clinicalHistory.analytics.push({ name: fileName, url: url, originalName: originalName });
    }

    await clinicalHistory.save();
    logger.info(`handleFileUpload - File saved to clinical history: ${fileName}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });

    return res.status(201).json({ message: 'File uploaded successfully', url });
  } catch (error) {
    logger.error('handleFileUpload - An error ocurred while uploading the file', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: error
    });
    
    logger.info('handleFileUpload - Deleting blob and local file if exists', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    await deleteBlob(fileName);
    await fs.unlink(filePath);

    return res.status(500).json({ message: 'Error uploading file' }); 
  }
}

const deleteFile = async (req, res) => {
  const { id, fileId } = req.params;
  const resourceType = req.path.includes('/image') ? 'image' : 'analytic';

  if (!id || !fileId) {
    return res.status(400).json({ message: 'clinicalHistoryId and fileId are required' });
  }

  const clinicalHistory = await ClinicalHistory.findById(id);

  if (!clinicalHistory) {
    logger.error(`deleteFile - Clinical history with id ${id} was not found`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(404).json({ message: 'Clinical history not found' });
  }

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    logger.error(`deleteFile - File ID ${fileId} is not a valid ObjectId`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(400).json({ message: 'File ID is not valid' });
  }

  var file;
  if (resourceType === 'image') {
    file = clinicalHistory.images.id(fileId);
  } else {
    file = clinicalHistory.analytics.id(fileId);
  }

  if (!file) {
    logger.error(`deleteFile - File with id ${fileId} was not found`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(404).json({ message: 'File not found' });
  }

  try {
    logger.debug(`deleteFile - Deleting file: ${file.name}`);
    await deleteBlob(file.name, resourceType);
    logger.debug(`deleteFile - File deleted from Azure Blob Storage: ${file.name}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    file.deleteOne();
    await clinicalHistory.save();

    logger.info(`deleteFile - File deleted successfully: ${file.name}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
    });
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    logger.error('deleteFile - Error deleting the file', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers && req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      error: error
    });
    return res.status(500).json({ message: 'Error deleting file' });
  }
}

export {
  handleFileUpload,
  deleteFile
};