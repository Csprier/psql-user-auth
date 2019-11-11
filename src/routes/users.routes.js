/*
CREATE TABLE users(
  user_id serial PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (355) NOT NULL,
  email VARCHAR (355) UNIQUE NOT NULL,
  authToken VARCHAR (500) NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT now(),
  last_login TIMESTAMP
);
*/

// =================================================================
// Database
import db from '../db/database';
import passport from 'passport';
import { hashPassword, validatePassword } from '../lib/password.utils';
import { createAuthToken } from '../lib/jwt.utils';
// Express & Router
const express = require('express');
const router = express.Router();

// =================================================================
// GET
router.get('/', (req, res, next) => {
  const getAllUsersQuery = 'SELECT * FROM users;';
  db.query(getAllUsersQuery)
    .then(result => console.log(result))
    .catch(err => console.error(err));
  res.sendStatus(200);
});

/* =================================================================================== */
// PROTECTED
router.use('/:id', passport.authenticate('jwt', { session: false, failWithError: true }));

// =================================================================
// GET/:id
router.get('/:id', (req, res, next) => {
  const getUserByIDQuery = 'SELECT * FROM users WHERE user_id = $1;';
  const id = parseInt(req.params.id);
  console.log('GET /:id', id);
  db.query(getUserByIDQuery, [id])
    .then(result => console.log(result))
    .catch(err => console.error(err));
  res.sendStatus(200);
});

// =================================================================
// POST
router.post('/', (req, res, next) => {
  // let username = req.body.username,
  //     email = req.body.email,
  //     password = req.body.password,
  //     authToken = createAuthToken(req.username);
  const password = req.body.password;
  return hashPassword(password)
    .then(digest => {
      let username = req.body.username,
          email = req.body.email,
          authToken = createAuthToken(req.body.username);
      JSON.stringify(authToken);
      const newUser = [ username, digest, email, authToken ];
      const createNewUserQuery = 'INSERT INTO users(username, password, email, authToken) VALUES($1, $2, $3, $4) RETURNING user_id, username, email, authToken;';
      db.query(createNewUserQuery, newUser)
        .then(user => console.log(user[0]))
        .catch(err => console.error(err));
      res.sendStatus(201);
    })
    .catch(err => console.error(err));
});


// =================================================================
// PUT
router.put('/:id', (req, res, next) => {
  let user_id = req.body.user_id,
      { username, email } = req.body;
  const updateUserQuery = 'UPDATE users SET username = $1, email = $2 WHERE user_id = $3;',
        params = [ username, email, user_id ];
  db.query(updateUserQuery, params)
    .then(result => console.log(result[0]))
    .catch(err => console.error(err));
  res.sendStatus(200);
});

// =================================================================
// DELETE
router.delete('/:id', (req, res, next) => {
  let user_id = req.body.user_id;
  const deleteUserQuery = 'DELETE FROM users WHERE user_id = $1;',
        params = [ user_id ];
  db.query(deleteUserQuery, params)
    .then(() => console.log('Deleted User!'))
    .catch(err => console.error(err));
  res.sendStatus(204);
});

module.exports = router;