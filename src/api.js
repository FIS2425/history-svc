import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import requestLogger from './middleware/requestLogger.js';
import clinicalHistoryRoutes from './routes/clinicalHistoryRoutes.js';
import { verifyToken } from './middleware/verifyToken.js';
import logger from './config/logger.js';
import KafkaTransport from './utils/kafkaTransport.js';

const swaggerDocument = YAML.load('./openapi.yaml');
const prefix = process.env.API_PREFIX || '';

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

  app.use(prefix + '/histories', verifyToken, clinicalHistoryRoutes);
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  return app;
}

async function shutdown() {
  console.log('Shutting down the application...');

  if (process.env.NODE_ENV === 'production') {
    try {
      for (const transport of logger.transports) {
        if (transport instanceof KafkaTransport) {
          await transport.close();
          console.log('Kafka producer disconnected');
        }
      }
    } catch (error) {
      console.error('Error disconnecting Kafka producer:', error);
    }
  }

  console.log('HTTP server closed');
  process.exit(0);
}

process.on('SIGINT', async () => {
  console.log('SIGINT received');
  await shutdown();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await shutdown();
});

process.on('uncaughtException', async (error) => {
  console.error('Uncaught exception:', error);
  await shutdown();
});

process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled promise rejection:', reason);
  await shutdown();
});
