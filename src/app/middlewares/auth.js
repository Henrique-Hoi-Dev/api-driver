import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status';
import { promisify } from 'util';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'INVALID_TOKEN' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);

    req.driverId = decoded.id;
    req.driverProps = decoded;

    return next();
  } catch (err) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'INVALID_TOKEN' });
  }
};
