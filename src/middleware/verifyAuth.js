import logger from '../config/logger.js';

export const verifyAdmin = (req, res, next) => {
  const user = req.user;
  if (!user.roles.includes('admin')) {
    logger.error('Error on token validation', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      userId: user.userId,
      error: 'Access denied. Insufficient permissions.',
      roles: user.roles
    });
    return res.status(403).send({ error: 'Access denied: Insufficient permissions' });
  }
  next();
}

export const verifyDoctorOrHigher = (req, res, next) => {
  const user = req.user;
  if (!user.roles.some(role => ['doctor', 'admin', 'clinicadmin'].includes(role))) {
    logger.error('Error on token validation', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      userId: user.userId,
      error: 'Access denied. Insufficient permissions.',
      roles: user.roles
    });
    return res.status(403).send({ error: 'Access denied: Insufficient permissions' });
  }
  next();
}

export const verifyPatientOrHigher = (req, res, next) => {
  const user = req.user;
  if (!user.roles.some(role => ['patient', 'doctor', 'admin', 'clinicadmin'].includes(role))) {
    logger.error('Error on token validation', {
      method: req.method,
      url: req.originalUrl,
      ip: req.headers['x-forwarded-for'] || req.ip,
      requestId: req.headers && req.headers['x-request-id'] || null,
      userId: user.userId,
      error: 'Access denied. Insufficient permissions.',
      roles: user.roles
    });
    return res.status(403).send({ error: 'Access denied: Insufficient permissions' });
  }
  next();
}

 