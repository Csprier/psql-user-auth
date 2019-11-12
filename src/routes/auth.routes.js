import express from 'express';
import passport from 'passport';
import db from '../db/database';
import { createAuthToken } from '../lib/jwt.utils';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

// ========================================================================
const localAuth = passport.authenticate('local', { 
  session: false, 
  failWithError: true 
});

// ========================================================================
// Login endpoint for login
router.post('/login', localAuth, (req, res) => {
  console.log('req.user:', req.user);
  const authToken = createAuthToken(req.user);
  const updateUserAuthTokenColumnQuery = 'UPDATE users SET authToken = $1 WHERE user_id = $2;',
        params = [ authToken, user_id ];
  db.query(updateUserAuthTokenColumnQuery, params)
    .then(result => console.log(result[0]))
    .catch(err => console.error(err));
  
  // Set the authToken in localStorage
  localStorage.setItem('authToken', authToken);
	return res.status(200).json({ authToken });
});

// ========================================================================
// Logout endpoint for logout
router.post('/logout', localAuth, (req, res) => {
  const removeUserAuthTokenColumnDataQuery = `UPDATE users SET authToken = '' WHERE user_id = $1;`,
        params = [ user_id ];
  db.query(removeUserAuthTokenColumnDataQuery, params)
    .then(result => console.log(result[0]))
    .catch(err => console.error(err));

  // Destroy the authToken from localStorage
  localStorage.removeItem('authToken');
  return res.json(200);
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
// ========================================================================
// Refresh AuthToken
router.use('/refresh', passport.authenticate('jwt', { 
  session: false, 
  failWithError: true 
}));

// ========================================================================
router.post('/refresh', jwtAuth, (req, res, next) => {
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