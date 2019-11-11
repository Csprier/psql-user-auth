import jwt from 'jsonwebtoken';
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

/**
 * Export a createAuthToken function that signs the JWT 
 * for the user when it's created or logs in
 */

module.exports = {
  createAuthToken: (user) => {
    return jwt.sign({ user }, JWT_SECRET, {
      subject: user,
      expiresIn: JWT_EXPIRY
    });
  },
};