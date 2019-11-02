/*
CREATE TABLE users2(
  user_id serial PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  email VARCHAR (355) UNIQUE NOT NULL,
  authToken VARCHAR () NOT NULL, <-----------------------
  created_on TIMESTAMP NOT NULL DEFAULT now(),
  last_login TIMESTAMP
);
*/

// =================================================================
// Database
import db from '../db/database';
import passport from 'passport';
import { hashPassword, validatePassword } from '../lib/password.utils';
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
  let username = req.body.username,
      email = req.body.email,
      password = req.body.password,
      digest = hashPassword(password);
      newUser = [ username, digest, email ]
  const createNewUserQuery = 'INSERT INTO users(username, password, email) VALUES($1, $2, $3) RETURNING user_id, username, email;';
  db.query(createNewUserQuery, newUser)
    .then(result => console.log(result[0]))
    .catch(err => console.error(err));
  res.sendStatus(201);
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