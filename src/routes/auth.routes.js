import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import db from '../db/database';

const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const router = express.Router();

const localAuth = passport.authenticate('local', { 
  session: false, 
  failWithError: true 
});

// Login endpoint for login
router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	return res.status(200).json({ authToken });
});

// Refresh AuthToken
router.use('/refresh', passport.authenticate('jwt', { 
    session: false, 
    failWithError: true 
  }
));

router.post('/refresh', (req, res, next) => {
  let user_id = req.body.user_id;
  const findUserQuery = 'SELECT * FROM users WHERE user_id = $1;',
        params = [ user_id ];
  db.query(findUserQuery, params)
    .then(user => {
      const authToken = createAuthToken(user[0]);
      res.json({ authToken });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

// Generate AuthToken for user
const createAuthToken = (user) => {
	return jwt.sign({ user }, JWT_SECRET, {
		subject: user.username,
		expiresIn: JWT_EXPIRY
	});
};

module.exports = router;