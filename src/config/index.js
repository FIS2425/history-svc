import mongoose from 'mongoose';
import api from '../api.js';
import fs from 'fs/promises';

const MONGO_URI = process.env.MONGOURL;
const PORT = process.env.PORT || 3005;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Conexión con MongoDB OK');

    // Create the uploads directory if it doesn't exist
    fs.mkdir(UPLOAD_DIR, { recursive: true })
      .then(() => {
        console.log(`Directorio ${UPLOAD_DIR} creado`);
      })
      .catch((error) => {
        console.error('Error al crear el directorio: ', error.message);
      });

    const app = api();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error de conexión con MongoDB:', error.message);
  });
