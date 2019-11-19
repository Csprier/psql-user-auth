import express from 'express';
import passport from 'passport';
import db from '../db/database';
import { createAuthToken } from '../lib/jwt.utils';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

// ========================================================================
// Define strategy authenticators
const localAuth = passport.authenticate('local', { session: false, failWithError: true });

// ========================================================================
// Login endpoint for login
router.post('/login', localAuth, (req, res) => {
  // console.log('req.user:', req.user);
  const authToken = createAuthToken(req.user.username);
  const updateUserAuthTokenColumnQuery = 'UPDATE users SET authToken = $1 WHERE user_id = $2;',
        params = [ authToken, req.user.user_id ];
  db.query(updateUserAuthTokenColumnQuery, params)
    .then(result => console.log(result))
    .catch(err => console.error(err));

	return res.status(200).json({ authToken });
});

// ========================================================================
// Logout endpoint for logout
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
router.use('/logout', jwtAuth);
router.post('/logout', jwtAuth, (req, res) => {
  console.log('req', req.body.user_id);
  let user_id = req.body.user_id;
  const removeUserAuthTokenColumnDataQuery = `UPDATE users SET authToken = '' WHERE user_id = $1;`,
        params = [ user_id ];
  db.query(removeUserAuthTokenColumnDataQuery, params)
    .then(result => console.log(result))
    .catch(err => console.error(err));

  return res.status(204).json({ message: 'Logout successful' });
});

// ========================================================================
// Refresh AuthToken
router.use('/refresh', jwtAuth);
router.post('/refresh', jwtAuth, (req, res, next) => {
  let user_id = req.body.user_id;
  const findUserQuery = 'SELECT * FROM users WHERE user_id = $1;',
        params = [ user_id ];
  db.query(findUserQuery, params)
    .then(user => {
      console.log('user', user[0].username);
      const authToken = createAuthToken(user[0].username);
      console.log('New AuthToken:', authToken);
      db.query(
        'UPDATE users SET authToken = $1 WHERE user_id = $2;',
        [ authToken, user_id ]
      )
      .then(result => console.log(result))
      .catch(err => console.error(err));
      // Return the new authToken as json
      return res.json({ authToken });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;