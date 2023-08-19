import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'INVALID_TOKEN' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.driverId = decoded.id;
    req.driverProps = decoded;

    return next();
  } catch (err) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'INVALID_TOKEN' });
  }
};
