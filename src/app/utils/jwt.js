require('dotenv/config');
import jwt from 'jsonwebtoken';

export const generateToken = (payload = {}) => {
  const token = jwt.sign(payload, process.env.TOKEN_KEY, {
    expiresIn: process.env.TOKEN_EXP,
  });
  return token;
};
