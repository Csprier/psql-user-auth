/*
CREATE TABLE users(
  user_id serial PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  email VARCHAR (355) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);
*/

// =================================================================
// Database
import db from '../db/index';
// Express & Router
const express = require('express');
const router = express.Router();

// =================================================================
// GET
router.get('/', (req, res, next) => {
  const getAllUsersQuery = 'SELECT * FROM users';
  db.query(getAllUsersQuery, (err, res) => {
    if (err) {
      return next(err);
    }
    console.log(res.rows);
    // res.json(res.rows);
  });
});

// =================================================================
// GET/:id
router.get('/:id', (req, res, next) => {
  const getUserByIDQuery = 'SELECT * FROM users WHERE id = $1';
  const id = parseInt(req.params.id);
  console.log('GET /:id', id);
  db.query(getUserByIDQuery, [id], (err, res) => {
    if (err) {
      return next(err);
    }
    console.log(res.rows[0]);
    // res.status(200).json(result.rows);
  });
})

// =================================================================
// POST

// =================================================================
// PUT

// =================================================================
// DELETE

module.exports = router;