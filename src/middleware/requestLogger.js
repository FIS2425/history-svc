import logger from '../config/logger.js';

const requestLogger = (req, res, next) => {
  const { method, originalUrl } = req;
  const ip = req.headers?.['x-forwarded-for'] || req.socket.remoteAddress;

  const logData = {
    method: method,
    url: originalUrl,
    ip: ip,
  };
  
  if (Object.keys(req.body).length > 0) {
    logData.body = req.body;
  }
  if (req.headers?.requestId) {
    logData.requestId = req.headers.requestId;
  }
  
  // Log the request details
  logger.info(`${method} - ${originalUrl}`, logData);
  next();
};

export default requestLogger;
