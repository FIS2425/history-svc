import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import requestLogger from './middleware/requestLogger.js';
import clinicalHistoryRoutes from './routes/clinicalHistoryRoutes.js';


const swaggerDocument = YAML.load('./openapi.yaml');

export default function () {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestLogger);

  app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
  });

  app.use('/histories', clinicalHistoryRoutes);
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  return app;
}
