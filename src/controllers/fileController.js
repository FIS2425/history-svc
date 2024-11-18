import { BlobServiceClient } from '@azure/storage-blob';
import logger from '../config/logger.js';
import ClinicalHistory from '../models/ClinicalHistory.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';

const sasToken = process.env.AZURE_SAS_TOKEN;
const accountName = process.env.AZURE_ACCOUNT_NAME;
const imagesContainerName = process.env.AZURE_IMAGES_CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const imagesContainerClient = blobServiceClient.getContainerClient(imagesContainerName);

const uploadImageStream = async (fileName, filePath, mimeType) => {
  const blobClient = imagesContainerClient.getBlockBlobClient(fileName);

  // Upload file from disk
  const fileBuffer = await fs.readFile(filePath);
  await blobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });

  // Delete the local file
  await fs.unlink(filePath);

  return blobClient.url;
}

const deleteBlob = async (blobName) => {
  const blobClient = imagesContainerClient.getBlockBlobClient(blobName);
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


const handleImageUpload = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'clinicalHistoryId is required' });
  }

  const clinicalHistory = await ClinicalHistory.findById(id);

  if (!clinicalHistory) {
    logger.error(`handleImageUpload - Clinical history with id ${id} was not found`);
    return res.status(404).json({ message: 'Clinical history not found' });
  }

  const file = req.file;
  const fileName = file.filename
  const filePath = file.path;
  const mimeType = file.mimetype;
  const originalName = file.originalname;

  try {

    logger.debug(`handleImageUpload - Extracted metadata: ${fileName}, ${filePath}, ${mimeType}, ${originalName}`);

    const imageUrl = await uploadImageStream(fileName, filePath, mimeType);
    logger.info(`handleImageUpload - File uploaded to Azure Blob Storage: ${imageUrl}`);
    
    clinicalHistory.images.push({ name: fileName, url: imageUrl, originalName: originalName });

    await clinicalHistory.save();
    logger.info(`handleImageUpload - Image saved to clinical history: ${fileName}`);

    return res.status(201).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    logger.error('handleImageUpload - An error ocurred while uploading the file'+error);
    
    logger.info('handleImageUpload - Deleting blob and local file if exists');
    await deleteBlob(fileName);
    await fs.unlink(filePath);

    return res.status(500).json({ message: 'Error uploading image' }); 
  }
}

const deleteImage = async (req, res) => {
  const { id, imageId } = req.params;

  if (!id || !imageId) {
    return res.status(400).json({ message: 'clinicalHistoryId and imageId are required' });
  }

  const clinicalHistory = await ClinicalHistory.findById(id);

  if (!clinicalHistory) {
    logger.error(`deleteImage - Clinical history with id ${id} was not found`);
    return res.status(404).json({ message: 'Clinical history not found' });
  }

  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    logger.error(`deleteImage - Image ID ${imageId} is not a valid ObjectId`);
    return res.status(400).json({ message: 'Image ID is not valid' });
  }

  const image = clinicalHistory.images.id(imageId);

  if (!image) {
    logger.error(`deleteImage - Image with id ${imageId} was not found`);
    return res.status(404).json({ message: 'Image not found' });
  }

  try {
    logger.debug(`deleteImage - Deleting image: ${image.name}`);
    await deleteBlob(image.name);
    logger.debug(`deleteImage - Image deleted from Azure Blob Storage: ${image.name}`);
    image.deleteOne();
    await clinicalHistory.save();

    logger.info(`deleteImage - Image deleted successfully: ${image.name}`);
    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    logger.error('deleteImage - Error deleting the image', error);
    return res.status(500).json({ message: 'Error deleting image' });
  }
}

export {
  handleImageUpload,
  deleteImage
};