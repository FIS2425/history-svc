import logger from '../config/logger.js';

const requestLogger = (req, res, next) => {
  const { method, url } = req;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  logger.info(`Method: ${method}, URL: ${url}, IP: ${ip}`);
  // For debugging purposes, we can log the request body if it is not empty
  if (Object.keys(req.body).length > 0) {
    logger.debug(`Request body: ${JSON.stringify(req.body)}`);
  }
  next();
};

export default requestLogger;
