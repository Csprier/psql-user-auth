/*
CREATE TABLE users(
  user_id serial PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  email VARCHAR (355) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT now(),
  last_login TIMESTAMP
);
*/

// =================================================================
// Database
import db from '../db/database';
// Express & Router
const express = require('express');
const router = express.Router();

// =================================================================
// GET
router.get('/', (req, res, next) => {
  const getAllUsersQuery = 'SELECT * FROM users';
  db.query(getAllUsersQuery)
    .then(res => console.log(res))
    .catch(err => console.error(err));
});

// =================================================================
// GET/:id
router.get('/:id', (req, res, next) => {
  const getUserByIDQuery = 'SELECT * FROM users WHERE id = $1';
  const id = parseInt(req.params.id);
  console.log('GET /:id', id);
  db.query(getUserByIDQuery, [id])
    .then(res => console.log(res))
    .catch(err => console.error(err));
});

// =================================================================
// POST
router.post('/', (req, res, next) => {
  let username = req.body.username,
      email = req.body.email,
      password = req.body.password,
      newUser = [ username, password, email ];
  const createNewUserQuery = `INSERT INTO users(username, password, email) VALUES($1, $2, $3) RETURNING user_id, username, email;`
  db.query(createNewUserQuery, newUser)
    .then(res => console.log(res))
    .catch(err => console.error(err));
});


// =================================================================
// PUT

// =================================================================
// DELETE

module.exports = router;