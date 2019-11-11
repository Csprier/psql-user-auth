import express from 'express';
import passport from 'passport';
import db from '../db/database';
import { createAuthToken } from '../lib/jwt.utils';

const router = express.Router();

// ========================================================================
const localAuth = passport.authenticate('local', { 
  session: false, 
  failWithError: true 
});

// ========================================================================
// Login endpoint for login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.username);
  const updateUserAuthTokenColumnQuery = 'UPDATE users SET authToken = $1 WHERE user_id = $2;',
        params = [ authToken, user_id ];
  db.query(updateUserAuthTokenColumnQuery, params)
    .then(result => console.log(result[0]))
    .catch(err => console.error(err));
  
  localStorage.setItem('authToken', authToken);
	return res.status(200).json({ authToken });
});

router.post('/logout', localAuth, (req, res) => {
  // Destroy the authToken from localStorage
  localStorage.removeItem('authToken');
  return res.json(200);
});

// ========================================================================
// Refresh AuthToken
router.use('/refresh', passport.authenticate('jwt', { 
  session: false, 
  failWithError: true 
}));

// ========================================================================
router.post('/refresh', (req, res, next) => {
  let user_id = req.body.user_id;
  const findUserQuery = 'SELECT * FROM users WHERE user_id = $1;',
        params = [ user_id ];
  db.query(findUserQuery, params)
    .then(user => {
      const authToken = createAuthToken(user[0]);
      console.log('User', user[0]);
      res.json({ authToken });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;